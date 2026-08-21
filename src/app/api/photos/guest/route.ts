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

    const result = await findOrCreateGuest(name.trim());

    if (!result.created) {
      // Name already taken by another guest
      return NextResponse.json(
        { error: "name_taken", id: result.id },
        { status: 409 }
      );
    }

    return NextResponse.json({ id: result.id, name: result.name });
  } catch (error) {
    console.error("Guest creation error:", error);
    return NextResponse.json(
      { error: "Failed to create guest" },
      { status: 500 }
    );
  }
}