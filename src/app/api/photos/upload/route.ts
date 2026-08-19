import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGuest, upsertPhoto, getDb } from "@/lib/db";
import path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const guestName = formData.get("guestName") as string | null;
    const challengeId = formData.get("challengeId") as string | null;

    if (!file || !guestName || !challengeId) {
      return NextResponse.json(
        { error: "Missing required fields: file, guestName, challengeId" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const challengeDir = path.join(UPLOADS_DIR, challengeId);
    if (!fs.existsSync(challengeDir)) {
      fs.mkdirSync(challengeDir, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(challengeDir, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Store in database
    const guestId = findOrCreateGuest(guestName);
    upsertPhoto(guestId, challengeId, `${challengeId}/${filename}`, file.name);

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}