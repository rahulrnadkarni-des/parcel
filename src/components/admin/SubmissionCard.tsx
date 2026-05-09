"use client";

import { useState } from "react";
import Image from "next/image";
import { BAG_TYPES, PACKAGING_COLORS, BRANDING_STYLES, DISTINCTIVE_TAGS } from "@/lib/constants";

interface Option { id: string; name: string; slug: string }

interface Entry {
  id: string;
  photoUrl: string;
  bagType: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  brandingStyle: string | null;
  distinctiveTags: string[];
  freeNotes: string | null;
  submitterEmail: string | null;
  submittedAt: Date | string;
  status: string;
  adminNotes: string | null;
  restaurant: { id: string; name: string; slug: string };
  area: { id: string; name: string; slug: string };
}

interface SubmissionCardProps {
  entry: Entry;
  showActions?: boolean;
  onReviewed?: (id: string) => void;
}

function label(arr: { value: string; label: string }[], val: string | null) {
  if (!val) return "—";
  return arr.find((x) => x.value === val)?.label ?? val;
}

export function SubmissionCard({ entry, showActions = false, onReviewed }: SubmissionCardProps) {
  const [loading, setLoading] = useState<"approve" | "reject" | "save" | "delete" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [localStatus, setLocalStatus] = useState(entry.status);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [areas, setAreas] = useState<Option[]>([]);
  const [restaurants, setRestaurants] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [editRestaurantId, setEditRestaurantId] = useState(entry.restaurant.id);
  const [editRestaurantName, setEditRestaurantName] = useState(entry.restaurant.name);
  const [editAreaId, setEditAreaId] = useState(entry.area.id);
  const [localRestaurantName, setLocalRestaurantName] = useState(entry.restaurant.name);
  const [localAreaName, setLocalAreaName] = useState(entry.area.name);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function openEdit() {
    setEditing(true);
    if (areas.length > 0) return;
    setLoadingOptions(true);
    const { areas: areasData, restaurants: restaurantsData } = await fetch("/api/admin/options").then((r) => r.json());
    setAreas(areasData);
    setRestaurants(restaurantsData);
    setLoadingOptions(false);
  }

  async function saveEdit() {
    setLoading("save");
    const body: Record<string, string> = { areaId: editAreaId, restaurantId: editRestaurantId };
    const currentName = restaurants.find((r) => r.id === editRestaurantId)?.name ?? localRestaurantName;
    if (editRestaurantName !== currentName) body.restaurantName = editRestaurantName;

    await fetch(`/api/admin/submissions/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const newArea = areas.find((a) => a.id === editAreaId);
    if (newArea) setLocalAreaName(newArea.name);
    setLocalRestaurantName(editRestaurantName);
    setLoading(null);
    setEditing(false);
  }

  async function review(action: "approve" | "reject", adminNotes?: string) {
    setLoading(action);
    await fetch(`/api/admin/submissions/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNotes }),
    });
    setLoading(null);
    if (showActions) {
      // Queue page: remove the card after review
      setDone(true);
      onReviewed?.(entry.id);
    } else {
      // Approved/Rejected pages: stay but reflect new status
      setLocalStatus(action === "approve" ? "APPROVED" : "REJECTED");
      setRejecting(false);
    }
  }

  async function deleteEntry() {
    setLoading("delete");
    await fetch(`/api/admin/submissions/${entry.id}`, { method: "DELETE" });
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
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold">{localRestaurantName}</p>
            <p className="text-stone-500 text-sm">{localAreaName}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <span className="text-xs text-stone-400">
              {new Date(entry.submittedAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
            <button
              onClick={() => (editing ? setEditing(false) : openEdit())}
              className="text-xs text-stone-400 hover:text-black transition-colors"
            >
              {editing ? "Close" : "Edit"}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Details */}
        {!editing && (
          <div className="space-y-1 text-sm text-stone-600 mb-3">
            {entry.bagType && <p><span className="text-stone-400">Bag </span>{label(BAG_TYPES as unknown as { value: string; label: string }[], entry.bagType)}</p>}
            {entry.primaryColor && <p><span className="text-stone-400">Color </span>{label(PACKAGING_COLORS as unknown as { value: string; label: string }[], entry.primaryColor)}{entry.secondaryColor && ` + ${label(PACKAGING_COLORS as unknown as { value: string; label: string }[], entry.secondaryColor)}`}</p>}
            {entry.brandingStyle && <p><span className="text-stone-400">Style </span>{label(BRANDING_STYLES as unknown as { value: string; label: string }[], entry.brandingStyle)}</p>}
            {entry.distinctiveTags.length > 0 && (
              <p><span className="text-stone-400">Tags </span>{entry.distinctiveTags.map((t) => label(DISTINCTIVE_TAGS as unknown as { value: string; label: string }[], t)).join(", ")}</p>
            )}
            {entry.freeNotes && <p><span className="text-stone-400">Notes </span>{entry.freeNotes}</p>}
            {entry.submitterEmail && <p><span className="text-stone-400">Submitter </span>{entry.submitterEmail}</p>}
          </div>
        )}

        {/* Edit panel */}
        {editing && (
          <div className="space-y-3 mb-3 pt-1">
            {loadingOptions ? (
              <p className="text-xs text-stone-400">Loading…</p>
            ) : (
              <>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Restaurant</label>
                  <select
                    value={editRestaurantId}
                    onChange={(e) => {
                      setEditRestaurantId(e.target.value);
                      const r = restaurants.find((r) => r.id === e.target.value);
                      if (r) setEditRestaurantName(r.name);
                    }}
                    className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Rename restaurant</label>
                  <input
                    type="text"
                    value={editRestaurantName}
                    onChange={(e) => setEditRestaurantName(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">Applies to all entries for this restaurant</p>
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Area</label>
                  <select
                    value={editAreaId}
                    onChange={(e) => setEditAreaId(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                disabled={loading === "save" || loadingOptions}
                className="flex-1 bg-black text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                {loading === "save" ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 border border-stone-300 text-sm py-1.5 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
            <p className="text-sm text-red-700">Delete this entry? This can&apos;t be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={deleteEntry}
                disabled={loading === "delete"}
                className="flex-1 bg-red-600 text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                {loading === "delete" ? "Deleting…" : "Yes, delete"}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-stone-300 text-sm py-1.5 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status toggle for approved/rejected cards */}
        {!showActions && !editing && !confirmDelete && !rejecting && (
          <div className="flex gap-2">
            {localStatus !== "APPROVED" && (
              <button
                onClick={() => review("approve")}
                disabled={!!loading}
                className="flex-1 bg-black text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                {loading === "approve" ? "Moving…" : "Move to approved"}
              </button>
            )}
            {localStatus !== "REJECTED" && (
              <button
                onClick={() => setRejecting(true)}
                disabled={!!loading}
                className="flex-1 border border-stone-300 text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                Move to rejected
              </button>
            )}
          </div>
        )}

        {!showActions && rejecting && (
          <div className="space-y-2">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={() => review("reject", reason)}
                disabled={!!loading}
                className="flex-1 bg-red-600 text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                {loading === "reject" ? "Moving…" : "Confirm"}
              </button>
              <button onClick={() => setRejecting(false)} className="flex-1 border border-stone-300 text-sm py-1.5 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Approve / Reject (queue) */}
        {showActions && !rejecting && !editing && !confirmDelete && (
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
              <button onClick={() => setRejecting(false)} className="flex-1 border border-stone-300 text-sm py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
