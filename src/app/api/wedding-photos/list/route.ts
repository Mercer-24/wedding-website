import { NextRequest, NextResponse } from "next/server";
import { getAllWeddingPhotos } from "@/lib/db";

export async function GET() {
  try {
    const photos = await getAllWeddingPhotos();
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Wedding photos list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}