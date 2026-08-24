import { NextRequest, NextResponse } from "next/server";
import { getAllPhotos, getAllWeddingPhotos } from "@/lib/db";
import { challenges } from "@/config/challenges";
import path from "path";
import * as fs from "fs";
import { ZipArchive } from "archiver";

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");

/**
 * Build a human-friendly folder name for a challenge.
 * Format: "01 - Das lustigste Foto" (sorted by challenge number)
 */
function challengeFolderName(challengeId: string): string {
  const ch = challenges.find((c) => c.id === challengeId);
  if (!ch) return challengeId;
  const num = String(ch.number).padStart(2, "0");
  return `${num} - ${ch.titleDe}`;
}

/**
 * Sanitize a filename to be safe inside a ZIP.
 * Replaces characters that are problematic on Windows/ZIP.
 */
function sanitizeName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Deduplicate filenames by appending a counter suffix.
 * e.g. ["Max.jpg", "Max_2.jpg", "Max_3.jpg"]
 */
function deduplicateNames(
  entries: { folder: string; guestName: string; ext: string; diskPath: string; originalName: string }[]
): { folder: string; zipName: string; diskPath: string }[] {
  const result: { folder: string; zipName: string; diskPath: string }[] = [];
  const counts = new Map<string, number>();

  for (const entry of entries) {
    const key = `${entry.folder}::${entry.guestName}`;
    const count = counts.get(key) || 0;
    counts.set(key, count + 1);

    const baseName = sanitizeName(entry.guestName) || sanitizeName(entry.originalName.replace(/\.[^.]+$/, ""));
    const zipName = count === 0
      ? `${baseName}${entry.ext}`
      : `${baseName}_${count + 1}${entry.ext}`;

    result.push({
      folder: entry.folder,
      zipName,
      diskPath: entry.diskPath,
    });
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // "challenge" | "wedding" | "all"

    // Collect all files to include in the ZIP
    const zipEntries: { folder: string; guestName: string; ext: string; diskPath: string; originalName: string }[] = [];

    // --- Challenge photos ---
    if (type === "challenge" || type === "all") {
      const photos = await getAllPhotos();
      for (const photo of photos) {
        const folder = challengeFolderName(photo.challenge_id);
        const ext = path.extname(photo.original_name) || path.extname(photo.filename) || ".jpg";
        const diskPath = path.join(UPLOADS_DIR, photo.filename);

        if (fs.existsSync(diskPath)) {
          zipEntries.push({
            folder,
            guestName: photo.guest_name || "Unbekannt",
            ext,
            diskPath,
            originalName: photo.original_name,
          });
        }
      }
    }

    // --- Wedding photos ---
    if (type === "wedding" || type === "all") {
      const weddingPhotos = await getAllWeddingPhotos();
      const weddingFolder = "Hochzeitsfotos";
      for (const photo of weddingPhotos) {
        const ext = path.extname(photo.original_name) || path.extname(photo.filename) || ".jpg";
        // Wedding photos: use guest name if available, otherwise fall back to original name
        const displayName = photo.guest_name
          ? photo.guest_name
          : photo.original_name.replace(/\.[^.]+$/, "");
        const diskPath = path.join(UPLOADS_DIR, photo.filename);

        if (fs.existsSync(diskPath)) {
          zipEntries.push({
            folder: weddingFolder,
            guestName: displayName,
            ext,
            diskPath,
            originalName: photo.original_name,
          });
        }
      }
    }

    if (zipEntries.length === 0) {
      return NextResponse.json(
        { error: "No photos found to download" },
        { status: 404 }
      );
    }

    // Deduplicate filenames within the same folder
    const namedEntries = deduplicateNames(zipEntries);

    // Build the ZIP stream using ZipArchive class from archiver
    const archive = new ZipArchive({ zlib: { level: 6 } });

    for (const entry of namedEntries) {
      archive.file(entry.diskPath, { name: entry.zipName, prefix: entry.folder });
    }

    archive.finalize();

    // Convert the archive stream to a Response
    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        archive.on("end", () => controller.close());
        archive.on("error", (err: Error) => controller.error(err));
      },
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `hochzeitsfotos_${dateStr}.zip`;

    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download ZIP error:", error);
    return NextResponse.json(
      { error: "Failed to create download" },
      { status: 500 }
    );
  }
}