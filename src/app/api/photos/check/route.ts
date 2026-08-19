import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGuest, hasGuestUploadedForChallenge } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");
    const guestName = searchParams.get("guestName");

    if (!challengeId || !guestName) {
      return NextResponse.json(
        { error: "Missing challengeId or guestName" },
        { status: 400 }
      );
    }

    const guestId = findOrCreateGuest(guestName);
    const exists = hasGuestUploadedForChallenge(guestId, challengeId);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}