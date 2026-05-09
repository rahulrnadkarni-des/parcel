import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const areas = await db.area.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(areas);
}
