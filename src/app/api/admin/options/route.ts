import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [areas, restaurants] = await Promise.all([
    db.area.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
    db.restaurant.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({ areas, restaurants });
}
