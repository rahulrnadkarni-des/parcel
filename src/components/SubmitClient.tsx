"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { IconSearch, IconChevronRight, IconChevronDown, IconClose, IconParcel, IconRestaurant, IconLocation } from "./icons";

interface Area { id: string; name: string; slug: string }
interface Restaurant { id: string; name: string; slug: string }

export function SubmitClient({ areas }: { areas: Area[] }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const cameraRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  function handleBackHome() {
    setExiting(true);
    sessionStorage.setItem("homeFromLeft", "1");
    setTimeout(() => router.push("/"), 320);
  }

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
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: restaurant.id,
        areaId: selectedArea.id,
        photoUrl,
        submitterEmail: email || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    setSubmissionId(data.id ?? null);
    setSuccess(true);
  }

  if (success) {
    return <SuccessScreen hasEmail={!!email} submissionId={submissionId} />;
  }

  const canSubmit = !!photoUrl && !!restaurant && !!selectedArea && !uploadingPhoto;

  return (
    <div
      className="fixed inset-0 bg-white overflow-y-auto transition-transform duration-[320ms] ease-in"
      style={{ transform: exiting ? "translateX(100%)" : "translateX(0)" }}
    >
    <div className="max-w-[480px] mx-auto min-h-screen bg-white">
      <Navbar variant="form" />

      {/* Hero banner with Back home */}
      <div className="px-5 pt-5">
        <div className="relative h-[153px] rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/Form hero banner.png" alt="" className="w-full h-full object-cover" />
          <button
            onClick={handleBackHome}
            className="absolute top-3 left-3 flex items-center gap-1 text-[12px] font-semibold text-white tracking-[-0.12px] hover:opacity-80 transition-opacity"
          >
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back home
          </button>
        </div>
      </div>

      {/* Step 1 — Upload photo */}
      <section className="border-t border-[#f1f1f1] mt-5 p-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-1 uppercase">Step 1</p>
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Upload photo</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Just the outside. The counter-sitting, label-up bag.
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
              <span className="text-[12px] font-semibold text-[#777] tracking-[-0.12px] leading-[18px]">Camera</span>
            </button>
            <button
              onClick={() => photosRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)] rounded-[8px] pt-4 pb-3 px-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Photos icon.svg" width={20} height={20} alt="" />
              <span className="text-[12px] font-semibold text-[#777] tracking-[-0.12px] leading-[18px]">Photos</span>
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
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Which restaurant?</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            Not listed? Add it. Someone&apos;s got to be first.
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
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Where in Bengaluru?</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            HSR people don&apos;t need to know what Whitefield is ordering.
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
          <p className="text-[16px] font-bold text-[#222] leading-[1.4] tracking-[-0.32px]">Share your email</p>
          <p className="text-[12px] text-[#777] leading-[1.4] mt-1">
            We&apos;ll ping you when your photo goes live.
          </p>
        </div>
        <div className="h-12 border border-[#e5e5e5] rounded-[8px] px-3 py-[10px] flex items-center focus-within:border-2 focus-within:border-[#222]">
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
              <>Submit for review</>

            )}
          </button>
          <p className="text-[10px] font-medium text-[#777] leading-[1.3] text-center">
            We check for anything sensitive. Clean bags go live in under 24 hrs.
          </p>
        </div>
      </section>

      <Footer />
    </div>
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
        className="relative flex items-center h-12 border border-[#e5e5e5] rounded-[8px] px-3 cursor-text focus-within:border-2 focus-within:border-[#222]"
        onClick={() => { if (!selected) { /* focus handled by input */ } }}
      >
        <IconRestaurant size={16} className="absolute left-3 text-[#999] pointer-events-none shrink-0" />
        {selected ? (
          <div className="flex items-center flex-1 pl-[26px] gap-2">
            <span className="flex-1 text-base text-[#222] leading-[18px] truncate">{selected.name}</span>
            <button onClick={clearSelection} className="shrink-0 hover:opacity-70 transition-opacity">
              <IconClose size={16} className="text-[#999]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-1 pl-[26px] gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => { if (results.length > 0 || noResults) setShowDropdown(true); }}
              placeholder="Search restaurant name"
              className="flex-1 text-base text-[#222] outline-none bg-transparent placeholder:text-[#afafaf] placeholder:leading-[18px]"
            />
            <IconChevronDown size={16} className="text-[#999] shrink-0" />
          </div>
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
                  className="flex items-center w-full h-10 border border-[#444] rounded-[10px] pl-3 pr-3 text-base font-semibold text-[#222] tracking-[-0.16px] disabled:opacity-40"
                >
                  {addingNew ? (
                    <div className="w-4 h-4 border-2 border-[#222] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  )}
                  <span className="ml-2">Add new restaurant</span>
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
        className={`relative flex items-center h-12 w-full rounded-[8px] px-3 text-left ${open ? "border-2 border-[#222]" : "border border-[#e5e5e5]"}`}
      >
        <IconLocation size={16} className="absolute left-3 text-[#999] pointer-events-none shrink-0" />
        <div className="flex items-center flex-1 pl-[26px] gap-2">
          <span className={`flex-1 text-base leading-[18px] ${selected ? "text-[#222]" : "text-[#afafaf]"}`}>
            {selected ? selected.name : "Select area"}
          </span>
          <IconChevronDown size={16} className="text-[#999] shrink-0" />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[52px] left-0 right-0 z-20 bg-white rounded-[8px] shadow-[0_2px_10px_0_rgba(0,0,0,0.2)] overflow-hidden max-h-[268px] overflow-y-auto">
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
function SuccessScreen({ hasEmail, submissionId }: { hasEmail: boolean; submissionId: string | null }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [sheetDone, setSheetDone] = useState(false);

  function handleBackHome() {
    setExiting(true);
    sessionStorage.setItem("homeFromLeft", "1");
    setTimeout(() => router.push("/"), 320);
  }

  return (
    <div
      className="fixed inset-0 bg-white overflow-y-auto transition-transform duration-[320ms] ease-in"
      style={{ transform: exiting ? "translateX(100%)" : "translateX(0)" }}
    >
    <div className="max-w-[480px] mx-auto min-h-screen bg-white flex flex-col">
      <style>{`
        @keyframes draw-check {
          from { stroke-dashoffset: 32; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes spin-badge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shine-sweep {
          0%     { transform: translateX(-22px); }
          13%    { transform: translateX(98px); }
          13.01% { transform: translateX(-22px); }
          100%   { transform: translateX(-22px); }
        }
        .success-badge {
          transform-box: fill-box;
          transform-origin: center;
          animation: spin-badge 10s linear infinite;
          animation-delay: 0.55s;
          animation-fill-mode: backwards;
        }
        .success-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: draw-check 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s forwards;
        }
        .shine-1 {
          animation: shine-sweep 2.8s linear 1.1s infinite backwards;
        }
        .shine-2 {
          animation: shine-sweep 2.8s linear 1.46s infinite backwards;
        }
      `}</style>
      <Navbar variant="white" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 text-center gap-6">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="badge-clip">
              <path d="M42.2991 12.4479C45.8388 6.72617 54.1612 6.72617 57.7009 12.4479V12.4479C59.9042 16.0092 64.2619 17.5952 68.2388 16.2833V16.2833C74.6282 14.1756 81.0035 19.5251 80.0373 26.1835V26.1835C79.4359 30.3278 81.7546 34.3439 85.6444 35.8952V35.8952C91.8938 38.3876 93.339 46.5835 88.3189 51.0631V51.0631C85.1943 53.8512 84.389 58.4182 86.3716 62.1068V62.1068C89.5568 68.0332 85.3957 75.2406 78.6706 75.4453V75.4453C74.4848 75.5727 70.9324 78.5535 70.0801 82.6536V82.6536C68.7107 89.2409 60.8903 92.0873 55.6071 87.9213V87.9213C52.3187 85.3284 47.6813 85.3284 44.3929 87.9213V87.9213C39.1097 92.0873 31.2893 89.2409 29.9199 82.6536V82.6536C29.0676 78.5535 25.5152 75.5727 21.3294 75.4453V75.4453C14.6043 75.2406 10.4432 68.0332 13.6284 62.1068V62.1068C15.611 58.4182 14.8057 53.8512 11.6811 51.0631V51.0631C6.66101 46.5835 8.10617 38.3876 14.3556 35.8952V35.8952C18.2454 34.3439 20.5641 30.3278 19.9627 26.1835V26.1835C18.9965 19.5251 25.3718 14.1756 31.7612 16.2833V16.2833C35.7381 17.5952 40.0958 16.0092 42.2991 12.4479V12.4479Z" />
            </clipPath>
          </defs>
          <path
            className="success-badge"
            d="M42.2991 12.4479C45.8388 6.72617 54.1612 6.72617 57.7009 12.4479V12.4479C59.9042 16.0092 64.2619 17.5952 68.2388 16.2833V16.2833C74.6282 14.1756 81.0035 19.5251 80.0373 26.1835V26.1835C79.4359 30.3278 81.7546 34.3439 85.6444 35.8952V35.8952C91.8938 38.3876 93.339 46.5835 88.3189 51.0631V51.0631C85.1943 53.8512 84.389 58.4182 86.3716 62.1068V62.1068C89.5568 68.0332 85.3957 75.2406 78.6706 75.4453V75.4453C74.4848 75.5727 70.9324 78.5535 70.0801 82.6536V82.6536C68.7107 89.2409 60.8903 92.0873 55.6071 87.9213V87.9213C52.3187 85.3284 47.6813 85.3284 44.3929 87.9213V87.9213C39.1097 92.0873 31.2893 89.2409 29.9199 82.6536V82.6536C29.0676 78.5535 25.5152 75.5727 21.3294 75.4453V75.4453C14.6043 75.2406 10.4432 68.0332 13.6284 62.1068V62.1068C15.611 58.4182 14.8057 53.8512 11.6811 51.0631V51.0631C6.66101 46.5835 8.10617 38.3876 14.3556 35.8952V35.8952C18.2454 34.3439 20.5641 30.3278 19.9627 26.1835V26.1835C18.9965 19.5251 25.3718 14.1756 31.7612 16.2833V16.2833C35.7381 17.5952 40.0958 16.0092 42.2991 12.4479V12.4479Z"
            fill="#03BC71"
          />
          <g clipPath="url(#badge-clip)">
            <g className="shine-1">
              <rect x="-5" y="-20" width="24" height="140" fill="white" fillOpacity="0.15" transform="rotate(20, 0, 50)" />
            </g>
            <g className="shine-2">
              <rect x="-5" y="-20" width="12" height="140" fill="white" fillOpacity="0.15" transform="rotate(20, 0, 50)" />
            </g>
          </g>
          <path
            className="success-check"
            d="M39.8333 52L46.4999 58.6667L61.1666 44"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h1 className="text-[24px] font-black text-[#222] leading-[1.3] mb-3">
            Your bag&apos;s in the queue.
          </h1>
          <p className="text-base text-[#777] leading-[1.4]">
            We&apos;ll review it and get it live within 24 hours.
          </p>
        </div>
      </div>

      <div className="pb-8 pt-5 px-5 flex flex-col gap-2">
        <button
          onClick={handleBackHome}
          className="flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
        >
          Back to searching
        </button>
        {!hasEmail && !sheetDone && (
          <button
            onClick={() => setShowSheet(true)}
            className="flex items-center justify-center w-full h-12 bg-white rounded-[10px] text-base font-semibold text-[#222] tracking-[-0.16px]"
          >
            Notify me when it&apos;s live
          </button>
        )}
      </div>

      {showSheet && (
        <NotifySheet
          submissionId={submissionId}
          onClose={() => setShowSheet(false)}
          onDone={() => { setSheetDone(true); setShowSheet(false); }}
        />
      )}
    </div>
    </div>
  );
}

function NotifySheet({ submissionId, onClose, onDone }: { submissionId: string | null; onClose: () => void; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDoneRef.current(), 300);
    }, 4000);
    return () => clearTimeout(t);
  }, [done]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  async function handleSubmit() {
    if (!email) return;
    setSubmitting(true);
    if (submissionId) {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, email }),
      }).catch(() => {});
    }
    setSubmitting(false);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <style>{`
        @keyframes notify-draw-check {
          from { stroke-dashoffset: 32; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes notify-spin-badge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes notify-shine-sweep {
          0%     { transform: translateX(-22px); }
          13%    { transform: translateX(98px); }
          13.01% { transform: translateX(-22px); }
          100%   { transform: translateX(-22px); }
        }
        .notify-badge {
          transform-box: fill-box;
          transform-origin: center;
          animation: notify-spin-badge 10s linear infinite;
          animation-delay: 0.55s;
          animation-fill-mode: backwards;
        }
        .notify-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: notify-draw-check 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s forwards;
        }
        .notify-shine-1 { animation: notify-shine-sweep 2.8s linear 1.1s infinite backwards; }
        .notify-shine-2 { animation: notify-shine-sweep 2.8s linear 1.46s infinite backwards; }
      `}</style>

      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />
      <div
        className="relative bg-white rounded-t-[20px] shadow-[0_-4px_5px_rgba(0,0,0,0.4)] max-w-[480px] w-full mx-auto flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-[15.5px] z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <IconClose size={20} className="text-white" />
        </button>

        <div className="pt-2 px-2">
          {/* Banner */}
          <div className="aspect-[353/120] rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.15)] mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/Form hero banner.png" alt="" className="w-full h-full object-cover" />
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-4 pb-2 px-3">
              <svg key="notify-success" width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="notify-badge-clip">
                    <path d="M42.2991 12.4479C45.8388 6.72617 54.1612 6.72617 57.7009 12.4479V12.4479C59.9042 16.0092 64.2619 17.5952 68.2388 16.2833V16.2833C74.6282 14.1756 81.0035 19.5251 80.0373 26.1835V26.1835C79.4359 30.3278 81.7546 34.3439 85.6444 35.8952V35.8952C91.8938 38.3876 93.339 46.5835 88.3189 51.0631V51.0631C85.1943 53.8512 84.389 58.4182 86.3716 62.1068V62.1068C89.5568 68.0332 85.3957 75.2406 78.6706 75.4453V75.4453C74.4848 75.5727 70.9324 78.5535 70.0801 82.6536V82.6536C68.7107 89.2409 60.8903 92.0873 55.6071 87.9213V87.9213C52.3187 85.3284 47.6813 85.3284 44.3929 87.9213V87.9213C39.1097 92.0873 31.2893 89.2409 29.9199 82.6536V82.6536C29.0676 78.5535 25.5152 75.5727 21.3294 75.4453V75.4453C14.6043 75.2406 10.4432 68.0332 13.6284 62.1068V62.1068C15.611 58.4182 14.8057 53.8512 11.6811 51.0631V51.0631C6.66101 46.5835 8.10617 38.3876 14.3556 35.8952V35.8952C18.2454 34.3439 20.5641 30.3278 19.9627 26.1835V26.1835C18.9965 19.5251 25.3718 14.1756 31.7612 16.2833V16.2833C35.7381 17.5952 40.0958 16.0092 42.2991 12.4479V12.4479Z" />
                  </clipPath>
                </defs>
                <path className="notify-badge" d="M42.2991 12.4479C45.8388 6.72617 54.1612 6.72617 57.7009 12.4479V12.4479C59.9042 16.0092 64.2619 17.5952 68.2388 16.2833V16.2833C74.6282 14.1756 81.0035 19.5251 80.0373 26.1835V26.1835C79.4359 30.3278 81.7546 34.3439 85.6444 35.8952V35.8952C91.8938 38.3876 93.339 46.5835 88.3189 51.0631V51.0631C85.1943 53.8512 84.389 58.4182 86.3716 62.1068V62.1068C89.5568 68.0332 85.3957 75.2406 78.6706 75.4453V75.4453C74.4848 75.5727 70.9324 78.5535 70.0801 82.6536V82.6536C68.7107 89.2409 60.8903 92.0873 55.6071 87.9213V87.9213C52.3187 85.3284 47.6813 85.3284 44.3929 87.9213V87.9213C39.1097 92.0873 31.2893 89.2409 29.9199 82.6536V82.6536C29.0676 78.5535 25.5152 75.5727 21.3294 75.4453V75.4453C14.6043 75.2406 10.4432 68.0332 13.6284 62.1068V62.1068C15.611 58.4182 14.8057 53.8512 11.6811 51.0631V51.0631C6.66101 46.5835 8.10617 38.3876 14.3556 35.8952V35.8952C18.2454 34.3439 20.5641 30.3278 19.9627 26.1835V26.1835C18.9965 19.5251 25.3718 14.1756 31.7612 16.2833V16.2833C35.7381 17.5952 40.0958 16.0092 42.2991 12.4479V12.4479Z" fill="#03BC71" />
                <g clipPath="url(#notify-badge-clip)">
                  <g className="notify-shine-1"><rect x="-5" y="-20" width="24" height="140" fill="white" fillOpacity="0.15" transform="rotate(20, 0, 50)" /></g>
                  <g className="notify-shine-2"><rect x="-5" y="-20" width="12" height="140" fill="white" fillOpacity="0.15" transform="rotate(20, 0, 50)" /></g>
                </g>
                <path className="notify-check" d="M39.8333 52L46.4999 58.6667L61.1666 44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[20px] font-black text-[#222] tracking-[-0.4px] pb-4">You will be notified.</p>
            </div>
          ) : (
            <div className="px-3">
              <h2 className="text-[24px] font-black text-[#222] leading-[1.3] mb-1">Share your email</h2>
              <p className="text-[14px] text-[#777] leading-[1.4] mb-4">We&apos;ll ping you when your photo goes live.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                className="w-full h-12 border border-[#e5e5e5] rounded-[8px] px-3 text-base text-[#222] outline-none placeholder:text-[#afafaf] focus:border-2 focus:border-[#222]"
              />
            </div>
          )}
        </div>

        {/* CTA */}
        {!done && (
          <div className="shrink-0 pb-12 pt-5 px-5">
            <button
              onClick={handleSubmit}
              disabled={!email || submitting}
              className="flex items-center justify-center w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)] disabled:opacity-40"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Notify me"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
