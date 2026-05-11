import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { submissionId, email } = await req.json();

  if (!submissionId || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const entry = await db.packagingEntry.findUnique({ where: { id: submissionId } });
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (entry.submitterEmail) {
    return NextResponse.json({ ok: true });
  }

  await db.packagingEntry.update({
    where: { id: submissionId },
    data: { submitterEmail: email },
  });

  return NextResponse.json({ ok: true });
}
