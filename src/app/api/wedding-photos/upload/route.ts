import { NextRequest, NextResponse } from "next/server";
import { insertWeddingPhoto } from "@/lib/db";
import path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
const WEDDING_DIR = path.join(UPLOADS_DIR, "wedding");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
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

    // Ensure wedding uploads directory exists
    if (!fs.existsSync(WEDDING_DIR)) {
      fs.mkdirSync(WEDDING_DIR, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(WEDDING_DIR, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Store in database (no guest association)
    const id = await insertWeddingPhoto(`wedding/${filename}`, file.name);

    return NextResponse.json({ success: true, id, filename });
  } catch (error) {
    console.error("Wedding photo upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}