import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ restaurantSlug: string }> }
) {
  const { restaurantSlug } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug: restaurantSlug },
    include: {
      packagingEntries: {
        where: { status: "APPROVED" },
        include: { area: { select: { id: true, name: true, slug: true } } },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}
