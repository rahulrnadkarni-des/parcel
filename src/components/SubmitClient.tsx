"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { IconSearch, IconChevronRight, IconClose, IconParcel } from "./icons";
import { useMarkBackward } from "@/lib/navigation";

interface Area { id: string; name: string; slug: string }
interface Restaurant { id: string; name: string; slug: string }

export function SubmitClient({ areas }: { areas: Area[] }) {
  const markBackward = useMarkBackward();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  async function uploadPhoto(file: File) {
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setPhotoUrl(data.url);
    setUploadingPhoto(false);
  }

  function handleFileChange(file: File) {
    setPhotoPreview(URL.createObjectURL(file));
    uploadPhoto(file);
  }

  async function handleSubmit() {
    if (!photoUrl || !restaurant || !selectedArea) return;
    setSubmitting(true);
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: restaurant.id,
        areaId: selectedArea.id,
        photoUrl,
        submitterEmail: email || undefined,
      }),
    });
    setSubmitting(false);
    setSuccess(true);
  }

  if (success) {
    return <SuccessScreen hasEmail={!!email} />;
  }

  const canSubmit = !!photoUrl && !!restaurant && !!selectedArea && !uploadingPhoto;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white">
      <Navbar variant="form" />

      {/* Hero banner with Back home */}
      <div className="px-5 pt-5">
        <div className="relative h-[153px] rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/Form hero banner.png" alt="" className="w-full h-full object-cover" />
          <Link
            href="/"
            onClick={markBackward}
            className="absolute top-3 left-3 flex items-center gap-1 text-[12px] font-semibold text-white tracking-[-0.12px] hover:opacity-80 transition-opacity"
          >
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back home
          </Link>
        </div>
      </div>

      {/* Step 1 — Upload photo */}
      <section className="border-t border-[#f1f1f1] mt-5 p-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-1 uppercase">Step 1</p>
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Upload photo</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Only share the outer parcel, nothing else.
          </p>
        </div>

        {photoPreview ? (
          <div className="relative rounded-[8px] overflow-hidden border border-[rgba(0,0,0,0.1)] mb-3" style={{ aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              onClick={() => { setPhotoPreview(null); setPhotoUrl(null); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
            >
              <IconClose size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)] rounded-[8px] pt-4 pb-3 px-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Camera icon.svg" width={20} height={20} alt="" />
              <span className="text-[12px] font-semibold text-[#777] tracking-[-0.12px] leading-[18px]">Take photo</span>
            </button>
            <button
              onClick={() => photosRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)] rounded-[8px] pt-4 pb-3 px-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Photos icon.svg" width={20} height={20} alt="" />
              <span className="text-[12px] font-semibold text-[#777] tracking-[-0.12px] leading-[18px]">From photos</span>
            </button>
          </div>
        )}

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />
        <input
          ref={photosRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />
      </section>

      {/* Step 2 — Restaurant name */}
      <section className="border-t border-[#f1f1f1] p-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-1 uppercase">Step 2</p>
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Restaurant name</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Restaurant missing? Be the first to add it and help others.
          </p>
        </div>
        <RestaurantField
          selected={restaurant}
          onSelect={setRestaurant}
        />
      </section>

      {/* Step 3 — Area */}
      <section className="border-t border-[#f1f1f1] p-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-1 uppercase">Step 3</p>
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Area in Bengaluru</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Select the area. HSR folks don&apos;t want Whitefield restaurants.
          </p>
        </div>
        <AreaField
          areas={areas}
          selected={selectedArea}
          onSelect={setSelectedArea}
        />
      </section>

      {/* Optional email */}
      <section className="border-t border-[#f1f1f1] p-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-1 uppercase">Optional</p>
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Your email</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Drop your email if you want updates on your submission.
          </p>
        </div>
        <div className="h-12 border border-[#e5e5e5] rounded-[8px] px-3 py-[10px] flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 text-base text-[#222] outline-none bg-transparent placeholder:text-[#afafaf] placeholder:leading-[18px]"
          />
        </div>
      </section>

      {/* Submit */}
      <section className="border-t border-[#f1f1f1] pb-8 pt-5 px-5">
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)] disabled:opacity-40 transition-opacity"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><IconParcel size={16} />Share for review</>
            )}
          </button>
          <p className="text-[10px] font-medium text-[#777] leading-[1.3] text-center">
            We will review for any sensitive info. If it's clear, it goes live in under 24 hours.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Restaurant field with inline dropdown ──────────────────
function RestaurantField({
  selected,
  onSelect,
}: {
  selected: Restaurant | null;
  onSelect: (r: Restaurant | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Restaurant[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleQueryChange(q: string) {
    setQuery(q);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/restaurants?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setNoResults(data.length === 0);
      setShowDropdown(true);
    }, 280);
  }

  async function handleAddNew() {
    if (!query.trim()) return;
    setAddingNew(true);
    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: query.trim() }),
    });
    const data = await res.json();
    onSelect(data);
    setShowDropdown(false);
    setAddingNew(false);
  }

  function clearSelection() {
    onSelect(null);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setNoResults(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className="flex items-center h-12 border border-[#e5e5e5] rounded-[8px] px-3 gap-2.5 cursor-text"
        onClick={() => { if (!selected) { /* focus handled by input */ } }}
      >
        <IconSearch size={16} className="text-[#999] shrink-0" />
        {selected ? (
          <>
            <span className="flex-1 text-base text-[#222] leading-[18px] truncate">{selected.name}</span>
            <button
              onClick={clearSelection}
              className="shrink-0 hover:opacity-70 transition-opacity"
            >
              <IconClose size={16} className="text-[#999]" />
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => { if (results.length > 0 || noResults) setShowDropdown(true); }}
              placeholder="Search restaurant name"
              className="flex-1 text-base text-[#222] outline-none bg-transparent placeholder:text-[#afafaf] placeholder:leading-[18px]"
            />
            <IconChevronRight size={16} className="text-[#999] shrink-0" />
          </>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && !selected && (
        <div className="absolute top-[52px] left-0 right-0 z-20 bg-white rounded-[8px] shadow-[0_2px_10px_0_rgba(0,0,0,0.2)] overflow-hidden">
          {noResults ? (
            <>
              <div className="pl-4 pr-4 py-3">
                <p className="text-base text-[#777] leading-[18px]">No matching restaurants</p>
              </div>
              <div className="h-px bg-[#f1f1f1]" />
              <div className="p-4">
                <button
                  onClick={handleAddNew}
                  disabled={addingNew}
                  className="flex items-center justify-between w-full h-10 border border-[#444] rounded-[10px] pl-3 pr-3 text-base font-semibold text-[#222] tracking-[-0.16px] disabled:opacity-40"
                >
                  <span>Add new restaurant</span>
                  {addingNew ? (
                    <div className="w-4 h-4 border-2 border-[#222] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IconChevronRight size={16} className="text-[#222]" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="pl-4 pr-1 py-1">
              {results.map((r, i) => (
                <div key={r.id}>
                  <button
                    onClick={() => { onSelect(r); setShowDropdown(false); }}
                    className="w-full text-left py-3 text-base text-[#777] leading-[18px] hover:text-[#222] transition-colors"
                  >
                    {r.name}
                  </button>
                  {i < results.length - 1 && <div className="h-px bg-[#f1f1f1]" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Area field with inline dropdown ───────────────────────
function AreaField({
  areas,
  selected,
  onSelect,
}: {
  areas: Area[];
  selected: Area | null;
  onSelect: (a: Area) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Input-style trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center h-12 w-full border border-[#e5e5e5] rounded-[8px] px-3 gap-2.5 text-left"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="text-[#999] shrink-0">
          <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5C4 8.5 8 14.5 8 14.5C8 14.5 12 8.5 12 5.5C12 3.29 10.21 1.5 8 1.5ZM8 7.25C7.03 7.25 6.25 6.47 6.25 5.5C6.25 4.53 7.03 3.75 8 3.75C8.97 3.75 9.75 4.53 9.75 5.5C9.75 6.47 8.97 7.25 8 7.25Z" fill="currentColor" />
        </svg>
        <span
          className={`flex-1 text-base leading-[18px] ${
            selected ? "text-[#222]" : "text-[#afafaf]"
          }`}
        >
          {selected ? selected.name : "Select area"}
        </span>
        <IconChevronRight size={16} className="text-[#999] shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[52px] left-0 right-0 z-20 bg-white rounded-[8px] shadow-[0_2px_10px_0_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="pl-4 pr-1 py-1">
            {areas.map((area, i) => (
              <div key={area.id}>
                <button
                  onClick={() => { onSelect(area); setOpen(false); }}
                  className={`w-full text-left py-3 text-base leading-[18px] hover:text-[#222] transition-colors ${
                    selected?.id === area.id ? "text-[#222] font-semibold" : "text-[#777]"
                  }`}
                >
                  {area.name}
                </button>
                {i < areas.length - 1 && <div className="h-px bg-[#f1f1f1]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────
function SuccessScreen({ hasEmail }: { hasEmail: boolean }) {
  const markBackward = useMarkBackward();
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white flex flex-col">
      <Navbar variant="white" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 text-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/Success icon.svg" width={100} height={100} alt="" />
        <div>
          <h1 className="text-[24px] font-black text-[#222] leading-[1.3] mb-3">
            Shared successfully!
          </h1>
          <p className="text-base text-[#777] leading-[1.4]">
            We will review your parcel information and take it live in under 24 hours.
          </p>
        </div>
      </div>

      <div className="pb-8 pt-5 px-5 flex flex-col gap-2">
        <Link
          href="/"
          onClick={markBackward}
          className="flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
        >
          Go back to parcels
        </Link>
        {!hasEmail && (
          <Link
            href="/submit"
            className="flex items-center justify-center w-full h-12 bg-white rounded-[10px] text-base font-semibold text-[#222] tracking-[-0.16px]"
          >
            Get updates on email
          </Link>
        )}
      </div>
    </div>
  );
}
