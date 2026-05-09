import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";
import { BAG_TYPES, PACKAGING_COLORS } from "@/lib/constants";

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
