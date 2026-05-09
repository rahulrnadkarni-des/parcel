import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const areaSlug = req.nextUrl.searchParams.get("area");

  let areaId: string | undefined;
  if (areaSlug) {
    const area = await db.area.findUnique({ where: { slug: areaSlug } });
    if (area) areaId = area.id;
  }

  const entryWhere = {
    status: "APPROVED" as const,
    ...(areaId ? { areaId } : {}),
  };

  const restaurants = await db.restaurant.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      packagingEntries: { some: entryWhere },
    },
    include: {
      packagingEntries: {
        where: entryWhere,
        select: { photoUrl: true },
        take: 1,
        orderBy: { submittedAt: "desc" },
      },
      _count: {
        select: { packagingEntries: { where: entryWhere } },
      },
    },
    orderBy: { name: "asc" },
  });

  const [totalRestaurants, totalPackages] = await Promise.all([
    db.restaurant.count({
      where: { packagingEntries: { some: { status: "APPROVED" } } },
    }),
    db.packagingEntry.count({ where: { status: "APPROVED" } }),
  ]);

  return NextResponse.json({ restaurants, totalRestaurants, totalPackages });
}
