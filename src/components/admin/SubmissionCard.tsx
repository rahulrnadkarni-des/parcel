"use client";

import { useState } from "react";
import Image from "next/image";
import { BAG_TYPES, PACKAGING_COLORS, BRANDING_STYLES, DISTINCTIVE_TAGS } from "@/lib/constants";

interface Entry {
  id: string;
  photoUrl: string;
  bagType: string;
  primaryColor: string;
  secondaryColor: string | null;
  brandingStyle: string;
  distinctiveTags: string[];
  freeNotes: string | null;
  submitterEmail: string | null;
  submittedAt: Date | string;
  status: string;
  adminNotes: string | null;
  restaurant: { name: string; slug: string };
  area: { name: string };
}

interface SubmissionCardProps {
  entry: Entry;
  showActions?: boolean;
  onReviewed?: (id: string) => void;
}

function label(arr: { value: string; label: string }[], val: string) {
  return arr.find((x) => x.value === val)?.label ?? val;
}

export function SubmissionCard({ entry, showActions = false, onReviewed }: SubmissionCardProps) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  async function review(action: "approve" | "reject", adminNotes?: string) {
    setLoading(action);
    await fetch(`/api/admin/submissions/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNotes }),
    });
    setLoading(null);
    setDone(true);
    onReviewed?.(entry.id);
  }

  if (done) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="relative aspect-[4/3] bg-stone-100">
        <Image src={entry.photoUrl} alt="Packaging" fill className="object-cover" unoptimized />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold">{entry.restaurant.name}</p>
            <p className="text-stone-500 text-sm">{entry.area.name}</p>
          </div>
          <span className="text-xs text-stone-400">
            {new Date(entry.submittedAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>

        <div className="space-y-1 text-sm text-stone-600 mb-3">
          <p><span className="text-stone-400">Bag</span> {label(BAG_TYPES as unknown as { value: string; label: string }[], entry.bagType)}</p>
          <p><span className="text-stone-400">Color</span> {label(PACKAGING_COLORS as unknown as { value: string; label: string }[], entry.primaryColor)}{entry.secondaryColor && ` + ${label(PACKAGING_COLORS as unknown as { value: string; label: string }[], entry.secondaryColor)}`}</p>
          <p><span className="text-stone-400">Style</span> {label(BRANDING_STYLES as unknown as { value: string; label: string }[], entry.brandingStyle)}</p>
          {entry.distinctiveTags.length > 0 && (
            <p>
              <span className="text-stone-400">Tags</span>{" "}
              {entry.distinctiveTags.map((t) => label(DISTINCTIVE_TAGS as unknown as { value: string; label: string }[], t)).join(", ")}
            </p>
          )}
          {entry.freeNotes && <p><span className="text-stone-400">Notes</span> {entry.freeNotes}</p>}
          {entry.submitterEmail && <p><span className="text-stone-400">Submitter</span> {entry.submitterEmail}</p>}
        </div>

        {showActions && !rejecting && (
          <div className="flex gap-2">
            <button
              onClick={() => review("approve")}
              disabled={!!loading}
              className="flex-1 bg-black text-white text-sm py-2 rounded-lg disabled:opacity-40"
            >
              {loading === "approve" ? "Approving…" : "Approve"}
            </button>
            <button
              onClick={() => setRejecting(true)}
              disabled={!!loading}
              className="flex-1 border border-stone-300 text-sm py-2 rounded-lg disabled:opacity-40"
            >
              Reject
            </button>
          </div>
        )}

        {showActions && rejecting && (
          <div className="space-y-2">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason (sent to submitter if they left an email)"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={() => review("reject", reason)}
                disabled={!!loading}
                className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg disabled:opacity-40"
              >
                {loading === "reject" ? "Rejecting…" : "Confirm reject"}
              </button>
              <button
                onClick={() => setRejecting(false)}
                className="flex-1 border border-stone-300 text-sm py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
