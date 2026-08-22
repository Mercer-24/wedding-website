/**
 * SQLite Database Utility
 * 
 * Uses sql.js (WASM-based SQLite, no native dependencies).
 * The database file is stored at /data/wedding.db
 * inside the Docker container (mapped to a persistent volume).
 * 
 * Schema:
 *   - guests: name → identifies uploads
 *   - photos: guest_id + challenge_id → one photo per challenge per guest
 */

import initSqlJs, { Database } from "sql.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "wedding.db");

let _db: Database | null = null;
let _initialized = false;

async function ensureDb(): Promise<Database> {
  if (_db && _initialized) return _db;

  const SQL = await initSqlJs();

  // Load existing database from disk if it exists
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
  } else {
    _db = new SQL.Database();
  }

  // Create tables
  _db.run(`
    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      guest_id TEXT NOT NULL,
      challenge_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (guest_id) REFERENCES guests(id),
      UNIQUE(guest_id, challenge_id)
    );
  `);
  _db.run(`CREATE INDEX IF NOT EXISTS idx_photos_challenge ON photos(challenge_id)`);
  _db.run(`CREATE INDEX IF NOT EXISTS idx_photos_guest ON photos(guest_id)`);

  // Wedding photos — uploads with optional guest association
  _db.run(`
    CREATE TABLE IF NOT EXISTS wedding_photos (
      id TEXT PRIMARY KEY,
      guest_id TEXT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (guest_id) REFERENCES guests(id)
    );
  `);

  // Migration: add guest_id column if it doesn't exist (for existing databases)
  try {
    _db.run("ALTER TABLE wedding_photos ADD COLUMN guest_id TEXT");
  } catch {
    // Column already exists, ignore
  }

  saveDb();
  _initialized = true;
  return _db;
}

/** Persist the in-memory database to disk */
function saveDb(): void {
  if (!_db) return;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const data = _db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Helper: run a query that returns rows
function queryAll(sql: string, params: BindParams = []): Record<string, SqlJsValue>[] {
  if (!_db) throw new Error("Database not initialized");
  const stmt = _db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows: Record<string, SqlJsValue>[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: run a statement
function runStmt(sql: string, params: BindParams = []): void {
  if (!_db) throw new Error("Database not initialized");
  _db.run(sql, params);
  saveDb();
}

type BindParams = SqlJsValue[];
type SqlJsValue = number | string | Uint8Array | null;

// --- Guest operations ---

export async function findOrCreateGuest(name: string): Promise<{ id: string; name: string; created: boolean }> {
  const db = await ensureDb();
  const rows = queryAll("SELECT id FROM guests WHERE name = ?", [name]);
  if (rows.length > 0) {
    // Name already taken — return it so the caller can decide
    return { id: rows[0].id as string, name, created: false };
  }

  const id = uuidv4();
  runStmt("INSERT INTO guests (id, name) VALUES (?, ?)", [id, name]);
  return { id, name, created: true };
}

/**
 * Check if a guest name is already taken by someone else.
 * Returns the existing guest id if taken, null if available.
 */
export async function findGuestByName(name: string): Promise<string | null> {
  await ensureDb();
  const rows = queryAll("SELECT id FROM guests WHERE name = ?", [name]);
  return rows.length > 0 ? (rows[0].id as string) : null;
}

export async function getGuestName(guestId: string): Promise<string | null> {
  await ensureDb();
  const rows = queryAll("SELECT name FROM guests WHERE id = ?", [guestId]);
  return rows.length > 0 ? (rows[0].name as string) : null;
}

// --- Photo operations ---

export async function upsertPhoto(
  guestId: string,
  challengeId: string,
  filename: string,
  originalName: string
): Promise<string> {
  const db = await ensureDb();

  const existing = queryAll(
    "SELECT id, filename FROM photos WHERE guest_id = ? AND challenge_id = ?",
    [guestId, challengeId]
  );

  if (existing.length > 0) {
    const existingId = existing[0].id as string;
    const oldFilename = existing[0].filename as string;

    // Delete old file from disk
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
    const oldPath = path.join(uploadsDir, oldFilename);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    runStmt(
      "UPDATE photos SET filename = ?, original_name = ?, created_at = datetime('now') WHERE id = ?",
      [filename, originalName, existingId]
    );
    return existingId;
  }

  const id = uuidv4();
  runStmt(
    "INSERT INTO photos (id, guest_id, challenge_id, filename, original_name) VALUES (?, ?, ?, ?, ?)",
    [id, guestId, challengeId, filename, originalName]
  );
  return id;
}

export async function hasGuestUploadedForChallenge(
  guestId: string,
  challengeId: string
): Promise<boolean> {
  await ensureDb();
  const rows = queryAll(
    "SELECT id FROM photos WHERE guest_id = ? AND challenge_id = ?",
    [guestId, challengeId]
  );
  return rows.length > 0;
}

export async function getAllPhotos(): Promise<PhotoRecord[]> {
  await ensureDb();
  return queryAll(
    `SELECT p.id, p.challenge_id, p.filename, p.original_name, p.created_at,
            g.name as guest_name
     FROM photos p
     JOIN guests g ON p.guest_id = g.id
     ORDER BY p.created_at DESC`
  ) as unknown as PhotoRecord[];
}

export async function getPhotosByChallenge(challengeId: string): Promise<PhotoRecord[]> {
  await ensureDb();
  return queryAll(
    `SELECT p.id, p.challenge_id, p.filename, p.original_name, p.created_at,
            g.name as guest_name
     FROM photos p
     JOIN guests g ON p.guest_id = g.id
     WHERE p.challenge_id = ?
     ORDER BY p.created_at DESC`,
    [challengeId]
  ) as unknown as PhotoRecord[];
}

export interface PhotoRecord {
  id: string;
  challenge_id: string;
  filename: string;
  original_name: string;
  created_at: string;
  guest_name: string;
}

// --- Photo delete operations ---

export async function deletePhoto(id: string): Promise<void> {
  await ensureDb();
  const rows = queryAll("SELECT filename FROM photos WHERE id = ?", [id]);
  if (rows.length > 0) {
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
    const oldPath = path.join(uploadsDir, rows[0].filename as string);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    runStmt("DELETE FROM photos WHERE id = ?", [id]);
  }
}

// --- Wedding photos operations (optional guest association) ---

export async function insertWeddingPhoto(
  filename: string,
  originalName: string,
  guestId?: string | null
): Promise<string> {
  await ensureDb();
  const id = uuidv4();
  runStmt(
    "INSERT INTO wedding_photos (id, guest_id, filename, original_name) VALUES (?, ?, ?, ?)",
    [id, guestId || null, filename, originalName]
  );
  return id;
}

export async function deleteWeddingPhoto(id: string): Promise<void> {
  await ensureDb();
  const rows = queryAll("SELECT filename FROM wedding_photos WHERE id = ?", [id]);
  if (rows.length > 0) {
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
    const oldPath = path.join(uploadsDir, "wedding", rows[0].filename as string);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    runStmt("DELETE FROM wedding_photos WHERE id = ?", [id]);
  }
}

export async function getAllWeddingPhotos(): Promise<WeddingPhotoRecord[]> {
  await ensureDb();
  return queryAll(
    `SELECT wp.id, wp.filename, wp.original_name, wp.created_at,
            g.name as guest_name
     FROM wedding_photos wp
     LEFT JOIN guests g ON wp.guest_id = g.id
     ORDER BY wp.created_at DESC`
  ) as unknown as WeddingPhotoRecord[];
}

export interface WeddingPhotoRecord {
  id: string;
  filename: string;
  original_name: string;
  created_at: string;
  guest_name: string | null;
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  rank: number;
  guest_name: string;
  completed_challenges: number;
  last_upload_at: string; // when this guest reached their current challenge count
}

/**
 * Get the top N guests by number of completed challenges.
 *
 * Tiebreaker: if two guests have the same number of completed challenges,
 * the one who reached that count earlier (smaller MAX(created_at) of their
 * photo uploads) ranks higher.
 */
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  await ensureDb();
  const rows = queryAll(
    `SELECT
       g.name AS guest_name,
       COUNT(p.challenge_id) AS completed_challenges,
       MAX(p.created_at) AS last_upload_at
     FROM photos p
     JOIN guests g ON p.guest_id = g.id
     GROUP BY p.guest_id
     ORDER BY completed_challenges DESC, last_upload_at ASC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row, index) => ({
    rank: index + 1,
    guest_name: row.guest_name as string,
    completed_challenges: row.completed_challenges as number,
    last_upload_at: row.last_upload_at as string,
  }));
}