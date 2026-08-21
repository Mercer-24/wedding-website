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

export async function findOrCreateGuest(name: string): Promise<string> {
  const db = await ensureDb();
  const rows = queryAll("SELECT id FROM guests WHERE name = ?", [name]);
  if (rows.length > 0) return rows[0].id as string;

  const id = uuidv4();
  runStmt("INSERT INTO guests (id, name) VALUES (?, ?)", [id, name]);
  return id;
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