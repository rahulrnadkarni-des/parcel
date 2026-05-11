"use client";

import { useState } from "react";
import { SubmissionCard } from "./SubmissionCard";

type Entry = Parameters<typeof SubmissionCard>[0]["entry"];

export function ReviewedGridClient({ entries: initial }: { entries: Entry[] }) {
  const [entries, setEntries] = useState(initial);

  function handleReviewed(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (entries.length === 0) {
    return <p className="text-stone-400 text-sm">Nothing here.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <SubmissionCard key={entry.id} entry={entry} onReviewed={handleReviewed} />
      ))}
    </div>
  );
}
