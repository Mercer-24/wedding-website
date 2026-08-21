import { NextRequest, NextResponse } from "next/server";
import { deleteWeddingPhoto } from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    await deleteWeddingPhoto(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wedding photo delete error:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}