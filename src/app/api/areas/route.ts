import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const areas = await db.$queryRaw<{ id: string; name: string; slug: string }[]>`
    SELECT id, name, slug FROM areas ORDER BY display_order ASC, name ASC
  `;
  return NextResponse.json(areas);
}
