import { db } from "@/lib/db";
import { QueueClient } from "./QueueClient";

export default async function QueuePage() {
  const entries = await db.packagingEntry.findMany({
    where: { status: "PENDING" },
    include: {
      restaurant: { select: { name: true, slug: true } },
      area: { select: { name: true, slug: true } },
    },
    orderBy: { submittedAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Review queue</h1>
        <span className="text-sm text-stone-500">{entries.length} pending</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-stone-400 text-sm">Queue is clear.</p>
      ) : (
        <QueueClient entries={entries as Parameters<typeof QueueClient>[0]["entries"]} />
      )}
    </div>
  );
}
