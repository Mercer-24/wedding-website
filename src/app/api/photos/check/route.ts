import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGuest, hasGuestUploadedForChallenge } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");
    const guestId = searchParams.get("guestId");
    const guestName = searchParams.get("guestName");

    if (!challengeId) {
      return NextResponse.json(
        { error: "Missing challengeId" },
        { status: 400 }
      );
    }

    // Resolve guest: prefer guestId, fall back to guestName
    let resolvedGuestId = guestId;
    if (!resolvedGuestId && guestName) {
      const result = await findOrCreateGuest(guestName);
      resolvedGuestId = result.id;
    }

    if (!resolvedGuestId) {
      return NextResponse.json(
        { error: "Missing guestId or guestName" },
        { status: 400 }
      );
    }

    const exists = await hasGuestUploadedForChallenge(resolvedGuestId, challengeId);
    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}