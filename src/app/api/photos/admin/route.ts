import { NextRequest, NextResponse } from "next/server";
import { getAllPhotos, getPhotosByChallenge } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");

    const photos = challengeId
      ? getPhotosByChallenge(challengeId)
      : getAllPhotos();

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Admin photos error:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}