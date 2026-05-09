export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SubmissionCard } from "@/components/admin/SubmissionCard";

type EntryParam = Parameters<typeof SubmissionCard>[0]["entry"];

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
      {entries.length === 0 ? (
        <p className="text-stone-400 text-sm">Nothing approved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <SubmissionCard key={entry.id} entry={entry as EntryParam} />
          ))}
        </div>
      )}
    </div>
  );
}
