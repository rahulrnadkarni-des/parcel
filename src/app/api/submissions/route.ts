import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNewSubmissionAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { restaurantId, areaId, photoUrl, submitterEmail } = body;

  if (!restaurantId || !areaId || !photoUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
      photoUrl,
      submitterEmail: submitterEmail || null,
    },
  });

  sendNewSubmissionAlert({
    restaurantName: restaurant.name,
    areaName: area.name,
    bagType: "",
    primaryColor: "",
    photoUrl,
    submitterEmail,
  }).catch(console.error);

  return NextResponse.json({ id: entry.id }, { status: 201 });
}
