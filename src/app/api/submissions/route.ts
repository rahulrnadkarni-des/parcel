import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNewSubmissionAlert } from "@/lib/email";
import { BAG_TYPES, PACKAGING_COLORS } from "@/lib/constants";
import { BagType, PackagingColor, BrandingStyle } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    restaurantId,
    areaId,
    bagType,
    primaryColor,
    secondaryColor,
    brandingStyle,
    distinctiveTags,
    freeNotes,
    photoUrl,
    submitterEmail,
  } = body;

  if (!restaurantId || !areaId || !bagType || !primaryColor || !brandingStyle || !photoUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!Object.values(BagType).includes(bagType)) {
    return NextResponse.json({ error: "Invalid bag type" }, { status: 400 });
  }
  if (!Object.values(PackagingColor).includes(primaryColor)) {
    return NextResponse.json({ error: "Invalid primary color" }, { status: 400 });
  }
  if (!Object.values(BrandingStyle).includes(brandingStyle)) {
    return NextResponse.json({ error: "Invalid branding style" }, { status: 400 });
  }

  const [restaurant, area] = await Promise.all([
    db.restaurant.findUnique({ where: { id: restaurantId } }),
    db.area.findUnique({ where: { id: areaId } }),
  ]);

  if (!restaurant || !area) {
    return NextResponse.json({ error: "Invalid restaurant or area" }, { status: 400 });
  }

  const entry = await db.packagingEntry.create({
    data: {
      restaurantId,
      areaId,
      bagType,
      primaryColor,
      secondaryColor: secondaryColor || null,
      brandingStyle,
      distinctiveTags: Array.isArray(distinctiveTags) ? distinctiveTags : [],
      freeNotes: freeNotes || null,
      photoUrl,
      submitterEmail: submitterEmail || null,
    },
  });

  const bagTypeLabel = BAG_TYPES.find((b) => b.value === bagType)?.label ?? bagType;
  const colorLabel = PACKAGING_COLORS.find((c) => c.value === primaryColor)?.label ?? primaryColor;

  // Fire-and-forget — don't let email failure block the response
  sendNewSubmissionAlert({
    restaurantName: restaurant.name,
    areaName: area.name,
    bagType: bagTypeLabel,
    primaryColor: colorLabel,
    photoUrl,
    submitterEmail,
  }).catch(console.error);

  return NextResponse.json({ id: entry.id }, { status: 201 });
}
