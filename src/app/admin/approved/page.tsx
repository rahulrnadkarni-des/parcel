export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ReviewedGridClient } from "@/components/admin/ReviewedGridClient";

type EntryParam = Parameters<typeof ReviewedGridClient>[0]["entries"][number];

export default async function ApprovedPage() {
  const entries = await db.packagingEntry.findMany({
    where: { status: "APPROVED" },
    include: {
      restaurant: { select: { id: true, name: true, slug: true } },
      area: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { reviewedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Approved</h1>
        <span className="text-sm text-stone-500">{entries.length} entries</span>
      </div>
      <ReviewedGridClient entries={entries as EntryParam[]} />
    </div>
  );
}
