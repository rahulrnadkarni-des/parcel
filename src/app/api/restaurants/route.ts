import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const restaurants = await db.restaurant.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    orderBy: { name: "asc" },
    take: 10,
  });

  return NextResponse.json(restaurants);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = body.name?.trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name too short" }, { status: 400 });
  }

  const slug = toSlug(name);

  const existing = await db.restaurant.findFirst({
    where: { OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }] },
  });

  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  const restaurant = await db.restaurant.create({ data: { name, slug } });
  return NextResponse.json(restaurant, { status: 201 });
}
