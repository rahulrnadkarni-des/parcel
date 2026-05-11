"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { BAG_TYPES, PACKAGING_COLORS, BRANDING_STYLES, DISTINCTIVE_TAGS } from "@/lib/constants";
import { IconPencil, IconTrash2, IconClose, IconChevronDown, IconDownload, IconImageReplace } from "@/components/icons";

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
  const [loading, setLoading] = useState<"approve" | "reject" | "save" | "delete" | "replace" | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState(entry.photoUrl);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

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
    const body: Record<string, string> = { areaId: editAreaId };

    if (editRestaurantId === "__new__") {
      body.newRestaurantName = editRestaurantName;
    } else {
      body.restaurantId = editRestaurantId;
      const currentName = restaurants.find((r) => r.id === editRestaurantId)?.name ?? localRestaurantName;
      if (editRestaurantName !== currentName) body.restaurantName = editRestaurantName;
    }

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
    setDone(true);
    onReviewed?.(entry.id);
  }

  async function deleteEntry() {
    setLoading("delete");
    await fetch(`/api/admin/submissions/${entry.id}`, { method: "DELETE" });
    setDone(true);
    onReviewed?.(entry.id);
  }

  async function downloadPhoto() {
    const res = await fetch(localPhotoUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry.restaurant.slug}-${entry.id}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function pickReplacementFile(file: File) {
    setReplaceError(null);
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    // reset input so the same file can be re-picked if cancelled
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  }

  function cancelReplace() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setReplaceError(null);
  }

  async function confirmReplace() {
    if (!pendingFile) return;
    setLoading("replace");
    setReplaceError(null);
    try {
      const fd = new FormData();
      fd.append("file", pendingFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");
      const { url } = uploadData;
      if (!url) throw new Error("No URL returned");
      const patchRes = await fetch(`/api/admin/submissions/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!patchRes.ok) throw new Error("Save failed");
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      setLocalPhotoUrl(url);
      setPendingFile(null);
      setPendingPreview(null);
    } catch (err) {
      setReplaceError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(null);
  }

  if (done) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="relative aspect-[4/3] bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={localPhotoUrl}
          src={pendingPreview ?? localPhotoUrl}
          alt="Packaging"
          className="w-full h-full object-cover"
        />
        {loading === "replace" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <button
            onClick={downloadPhoto}
            title="Download photo"
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          >
            <IconDownload size={14} className="text-white" />
          </button>
        </div>
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && pickReplacementFile(e.target.files[0])}
        />
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
              onClick={() => { if (editing) { cancelReplace(); setEditing(false); } else { openEdit(); } }}
              title={editing ? "Close" : "Edit"}
              className="text-stone-400 hover:text-black transition-colors"
            >
              {editing ? <IconClose size={15} /> : <IconPencil size={15} />}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="text-stone-400 hover:text-red-500 transition-colors"
            >
              <IconTrash2 size={15} />
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
            {/* Replace photo */}
            <div>
              <label className="text-xs text-stone-400 block mb-1">Photo</label>
              {pendingPreview ? (
                <div className="space-y-2">
                  <p className="text-xs text-stone-600">Replace with this photo?</p>
                  {replaceError && <p className="text-xs text-red-500">{replaceError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={confirmReplace}
                      disabled={loading === "replace"}
                      className="flex-1 bg-black text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
                    >
                      {loading === "replace" ? "Uploading…" : "Confirm & save"}
                    </button>
                    <button
                      onClick={cancelReplace}
                      disabled={loading === "replace"}
                      className="flex-1 border border-stone-300 text-sm py-1.5 rounded-lg disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  className="flex items-center gap-2 w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-600 hover:border-stone-400 transition-colors"
                >
                  <IconImageReplace size={13} className="text-stone-400 shrink-0" />
                  Replace photo
                </button>
              )}
            </div>
            {loadingOptions ? (
              <p className="text-xs text-stone-400">Loading…</p>
            ) : (
              <>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Restaurant</label>
                  <div className="relative">
                    <select
                      value={editRestaurantId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditRestaurantId(val);
                        if (val === "__new__") {
                          setEditRestaurantName("");
                        } else {
                          const r = restaurants.find((r) => r.id === val);
                          if (r) setEditRestaurantName(r.name);
                        }
                      }}
                      className="w-full appearance-none border border-stone-200 rounded-lg px-3 pr-8 py-1.5 text-sm bg-white focus:outline-none focus:border-2 focus:border-black"
                    >
                      {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                      <option value="__new__">＋ New restaurant</option>
                    </select>
                    <IconChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">
                    {editRestaurantId === "__new__" ? "New restaurant name" : "Rename restaurant"}
                  </label>
                  <input
                    type="text"
                    value={editRestaurantName}
                    onChange={(e) => setEditRestaurantName(e.target.value)}
                    placeholder={editRestaurantId === "__new__" ? "e.g. Meghana Foods" : ""}
                    className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-2 focus:border-black"
                  />
                  {editRestaurantId !== "__new__" && (
                    <p className="text-[10px] text-stone-400 mt-0.5">Applies to all entries for this restaurant</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Area</label>
                  <div className="relative">
                  <select
                    value={editAreaId}
                    onChange={(e) => setEditAreaId(e.target.value)}
                    className="w-full appearance-none border border-stone-200 rounded-lg px-3 pr-8 py-1.5 text-sm bg-white focus:outline-none focus:border-2 focus:border-black"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <IconChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
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
            {entry.status !== "APPROVED" && (
              <button
                onClick={() => review("approve")}
                disabled={!!loading}
                className="flex-1 bg-black text-white text-sm py-1.5 rounded-lg disabled:opacity-40"
              >
                {loading === "approve" ? "Moving…" : "Move to approved"}
              </button>
            )}
            {entry.status !== "REJECTED" && (
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
