import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { SubmissionStatus } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statusParam = req.nextUrl.searchParams.get("status")?.toUpperCase();
  const status = statusParam && Object.values(SubmissionStatus).includes(statusParam as SubmissionStatus)
    ? (statusParam as SubmissionStatus)
    : undefined;

  const entries = await db.packagingEntry.findMany({
    where: status ? { status } : {},
    include: {
      restaurant: { select: { id: true, name: true, slug: true } },
      area: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(entries);
}
