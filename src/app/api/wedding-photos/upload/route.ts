import { NextRequest, NextResponse } from "next/server";
import { insertWeddingPhoto } from "@/lib/db";
import path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
const WEDDING_DIR = path.join(UPLOADS_DIR, "wedding");

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const guestId = formData.get("guestId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxMB = isVideo ? "50" : "10";
      return NextResponse.json(
        { error: `File too large. Maximum size for ${isVideo ? "videos" : "images"} is ${maxMB}MB.` },
        { status: 400 }
      );
    }

    // Ensure wedding uploads directory exists
    if (!fs.existsSync(WEDDING_DIR)) {
      fs.mkdirSync(WEDDING_DIR, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(WEDDING_DIR, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const mediaType = isVideo ? "video" : "photo";

    // Store in database
    const id = await insertWeddingPhoto(
      `wedding/${filename}`,
      file.name,
      guestId || undefined,
      mediaType
    );

    return NextResponse.json({ success: true, id, filename, mediaType });
  } catch (error) {
    console.error("Wedding photo upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}