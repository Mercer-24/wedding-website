import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGuest } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const id = findOrCreateGuest(name.trim());
    return NextResponse.json({ id, name: name.trim() });
  } catch (error) {
    console.error("Guest creation error:", error);
    return NextResponse.json(
      { error: "Failed to create guest" },
      { status: 500 }
    );
  }
}