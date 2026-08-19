/**
 * SQLite Database Utility
 * 
 * Uses better-sqlite3. The database file is stored at /data/wedding.db
 * inside the Docker container (mapped to a persistent volume).
 * 
 * Schema:
 *   - guests: name → identifies uploads
 *   - photos: guest_id + challenge_id → one photo per challenge per guest
 */

import BetterSqlite3 from "better-sqlite3";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "wedding.db");

let _db: BetterSqlite3.Database | null = null;

export function getDb(): BetterSqlite3.Database {
  if (_db) return _db;

  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new BetterSqlite3(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  // Create tables
  _db.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

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

    CREATE INDEX IF NOT EXISTS idx_photos_challenge ON photos(challenge_id);
    CREATE INDEX IF NOT EXISTS idx_photos_guest ON photos(guest_id);
  `);

  return _db;
}

// --- Guest operations ---

export function findOrCreateGuest(name: string): string {
  const db = getDb();

  const existing = db
    .prepare("SELECT id FROM guests WHERE name = ?")
    .get(name) as { id: string } | undefined;

  if (existing) return existing.id;

  const id = uuidv4();
  db.prepare("INSERT INTO guests (id, name) VALUES (?, ?)").run(id, name);
  return id;
}

export function getGuestName(guestId: string): string | null {
  const db = getDb();
  const row = db
    .prepare("SELECT name FROM guests WHERE id = ?")
    .get(guestId) as { name: string } | undefined;
  return row?.name ?? null;
}

// --- Photo operations ---

export function upsertPhoto(
  guestId: string,
  challengeId: string,
  filename: string,
  originalName: string
): string {
  const db = getDb();
  const id = uuidv4();

  const existing = db
    .prepare("SELECT id, filename FROM photos WHERE guest_id = ? AND challenge_id = ?")
    .get(guestId, challengeId) as { id: string; filename: string } | undefined;

  if (existing) {
    // Delete old file from disk
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
    const oldPath = path.join(uploadsDir, existing.filename);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    db.prepare(
      "UPDATE photos SET filename = ?, original_name = ?, created_at = datetime('now') WHERE id = ?"
    ).run(filename, originalName, existing.id);
    return existing.id;
  }

  db.prepare(
    "INSERT INTO photos (id, guest_id, challenge_id, filename, original_name) VALUES (?, ?, ?, ?, ?)"
  ).run(id, guestId, challengeId, filename, originalName);
  return id;
}

export function hasGuestUploadedForChallenge(
  guestId: string,
  challengeId: string
): boolean {
  const db = getDb();
  const row = db
    .prepare("SELECT id FROM photos WHERE guest_id = ? AND challenge_id = ?")
    .get(guestId, challengeId);
  return !!row;
}

export function getAllPhotos(): PhotoRecord[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT p.id, p.challenge_id, p.filename, p.original_name, p.created_at,
              g.name as guest_name
       FROM photos p
       JOIN guests g ON p.guest_id = g.id
       ORDER BY p.created_at DESC`
    )
    .all() as PhotoRecord[];
}

export function getPhotosByChallenge(challengeId: string): PhotoRecord[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT p.id, p.challenge_id, p.filename, p.original_name, p.created_at,
              g.name as guest_name
       FROM photos p
       JOIN guests g ON p.guest_id = g.id
       WHERE p.challenge_id = ?
       ORDER BY p.created_at DESC`
    )
    .all(challengeId) as PhotoRecord[];
}

export interface PhotoRecord {
  id: string;
  challenge_id: string;
  filename: string;
  original_name: string;
  created_at: string;
  guest_name: string;
}