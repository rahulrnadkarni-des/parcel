import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const restaurantSlug = req.nextUrl.searchParams.get("restaurant");
  const areaSlug = req.nextUrl.searchParams.get("area");

  const entries = await db.packagingEntry.findMany({
    where: {
      status: "APPROVED",
      ...(restaurantSlug && { restaurant: { slug: restaurantSlug } }),
      ...(areaSlug && { area: { slug: areaSlug } }),
    },
    include: {
      restaurant: { select: { id: true, name: true, slug: true } },
      area: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(entries);
}
