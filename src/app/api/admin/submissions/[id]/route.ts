import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action, adminNotes } = await req.json();

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const entry = await db.packagingEntry.findUnique({
    where: { id },
    include: {
      restaurant: { select: { name: true, slug: true } },
    },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.packagingEntry.update({
    where: { id },
    data: {
      status: action === "approve" ? "APPROVED" : "REJECTED",
      adminNotes: adminNotes || null,
      reviewedAt: new Date(),
    },
  });

  if (entry.submitterEmail) {
    if (action === "approve") {
      sendApprovalEmail({
        to: entry.submitterEmail,
        restaurantName: entry.restaurant.name,
        restaurantSlug: entry.restaurant.slug,
      }).catch(console.error);
    } else {
      sendRejectionEmail({
        to: entry.submitterEmail,
        restaurantName: entry.restaurant.name,
        reason: adminNotes,
      }).catch(console.error);
    }
  }

  return NextResponse.json(updated);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { restaurantId, restaurantName, areaId } = await req.json();

  const entry = await db.packagingEntry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, string> = {};
  if (areaId) data.areaId = areaId;
  if (restaurantId) data.restaurantId = restaurantId;

  const updated = await db.packagingEntry.update({
    where: { id },
    data,
    include: {
      restaurant: { select: { id: true, name: true, slug: true } },
      area: { select: { id: true, name: true, slug: true } },
    },
  });

  if (restaurantName) {
    await db.restaurant.update({
      where: { id: updated.restaurantId },
      data: { name: restaurantName },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.packagingEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
