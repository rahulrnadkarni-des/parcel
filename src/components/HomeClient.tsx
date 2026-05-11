"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { InfoModal } from "./InfoModal";
import { IconSearch, IconClose, IconArrowRight, IconParcel } from "./icons";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  packagingEntries: { photoUrl: string }[];
  _count: { packagingEntries: number };
}

interface Area {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialRestaurants: Restaurant[];
  areas: Area[];
  initialTotalPackages: number;
}

const INITIAL_LIMIT = 6;

export function HomeClient({ initialRestaurants, areas, initialTotalPackages }: Props) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [totalPackages, setTotalPackages] = useState(initialTotalPackages);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [slideIn, setSlideIn] = useState<"idle" | "start" | "done">("idle");

  useLayoutEffect(() => {
    if (sessionStorage.getItem("homeFromLeft") === "1") {
      sessionStorage.removeItem("homeFromLeft");
      setSlideIn("start");
      requestAnimationFrame(() => requestAnimationFrame(() => setSlideIn("done")));
    }
  }, []);

  useEffect(() => {
    if (!search && !selectedArea) {
      setRestaurants(initialRestaurants);
      setTotalPackages(initialTotalPackages);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (selectedArea) params.set("area", selectedArea);
      const res = await fetch(`/api/library/restaurants?${params}`);
      const data = await res.json();
      setRestaurants(data.restaurants);
      setTotalPackages(data.totalPackages);
      setLoading(false);
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, selectedArea, initialRestaurants, initialTotalPackages]);

  useEffect(() => { setShowAll(false); }, [search, selectedArea]);

  useEffect(() => {
    if (sessionStorage.getItem("modalSeen")) return;
    const t = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem("modalSeen", "1");
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const displayed = showAll ? restaurants : restaurants.slice(0, INITIAL_LIMIT);
  const hasMore = restaurants.length > INITIAL_LIMIT && !showAll;
  const isFiltered = !!search || !!selectedArea;
  const isSearchActive = !!search || searchFocused;
  const selectedAreaName = areas.find((a) => a.slug === selectedArea)?.name;
  const isEmpty = !loading && restaurants.length === 0;

  return (
    <div
      className="max-w-[480px] mx-auto min-h-screen bg-white relative"
      style={
        slideIn === "start"
          ? { transform: "translateX(-100%)" }
          : slideIn === "done"
          ? { transform: "translateX(0)", transition: "transform 320ms ease-out" }
          : undefined
      }
    >

      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: isSearchActive ? 100 : 273 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/Hero banner.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[rgba(0,0,0,0.1)]" />
        <div className="relative z-10 flex flex-col h-full">
          <Navbar variant="hero" />
          <div
            className={`flex-1 min-h-0 flex items-end px-5 pb-12 overflow-hidden transition-opacity duration-200 ${
              isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <h1 className="text-[32px] font-black text-white leading-[1.3] text-shadow-hero">
              Is that your food? Let's find out.
            </h1>
          </div>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────── */}
      <div className="px-5 -mt-6 relative z-20">
        <div className="bg-white border border-[#e5e5e5] h-12 rounded-[14px] flex items-center pl-4 pr-[6px] py-[6px] gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search restaurant - Meghana foods, McDonalds"
            className="flex-1 h-full bg-transparent outline-none text-base text-[#222] placeholder:text-[#999] placeholder:leading-[1.4]"
          />
          <button
            onClick={() => { if (search) setSearch(""); }}
            className="w-9 h-full bg-[#222] rounded-[10px] flex items-center justify-center shrink-0 drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
          >
            {search ? <IconClose size={18} className="text-white" /> : <IconSearch size={20} className="text-white" />}
          </button>
        </div>
      </div>

      {/* ── Area filter chips ────────────────────────────── */}
      <div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-3 pt-5 pb-3 w-max">
            {areas.map((area) => {
              const active = selectedArea === area.slug;
              return (
                <button
                  key={area.slug}
                  onClick={() => setSelectedArea(active ? null : area.slug)}
                  className={`flex items-center gap-2 rounded-full whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#222] border border-transparent pl-3 pr-2 py-2 text-[12px] font-medium text-white"
                      : "bg-white border border-[#e5e5e5] px-3 py-2 text-[12px] text-[#999]"
                  }`}
                >
                  {area.name}
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 1L6 6M6 1L1 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {selectedArea && isSearchActive && isEmpty ? (
          <p className="px-5 pb-5 text-[14px] font-medium text-[#777] tracking-[-0.28px] leading-[20px]">
            Try removing the filter
          </p>
        ) : (
          <div className="pb-2" />
        )}
      </div>

      {/* ── Stats (no filter) ────────────────────────────── */}
      {!isFiltered && (
        <div className="border-t border-[#f1f1f1] p-5">
          <div className="flex flex-col gap-4">
            {/* Made with ♥ for Bengaluru */}
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-[#444] tracking-[-0.24px] leading-[1.3] whitespace-nowrap">
                Made with
              </span>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.57 3.07 2 5 2C6.19 2 7.23 2.61 8 3.5C8.77 2.61 9.81 2 11 2C12.93 2 14.5 3.57 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
                  fill="#FF4D4D"
                />
              </svg>
              <span className="text-[12px] text-[#444] tracking-[-0.24px] leading-[1.3] whitespace-nowrap">
                for Bengaluru
              </span>
            </div>

            {/* Two stat columns */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col min-w-0">
                <p className="text-[20px] font-black text-[#222] leading-[1.4]">
                  {initialRestaurants.length}
                </p>
                <p className="text-[12px] font-medium text-[#777] tracking-[-0.24px] leading-[1.3]">
                  Restaurants
                </p>
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <p className="text-[20px] font-black text-[#222] leading-[1.4]">{totalPackages}</p>
                <p className="text-[12px] font-medium text-[#777] tracking-[-0.24px] leading-[1.3]">
                  Packages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Restaurant grid ──────────────────────────────── */}
      <div className="border-t border-[#f1f1f1] pt-5 pb-8 px-5">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[20px] font-bold text-[#222] leading-[1.3] tracking-[-0.4px]">
            {search && !loading && restaurants.length === 0
              ? `Nothing yet for "${search}"`
              : search
              ? `Results for "${search}"`
              : selectedAreaName
              ? `Restaurants in ${selectedAreaName}`
              : "All restaurants"}
          </p>
          {isFiltered && !loading && (
            <p className="text-[14px] font-medium text-[#777] tracking-[-0.28px] leading-[1.3] shrink-0 ml-3">
              {restaurants.length} results
            </p>
          )}
        </div>

        {/* Empty / no results */}
        {isEmpty ? (
          <div className="text-center">
            <div className="pb-10 pt-8 px-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Error illustration.png" alt="" className="w-[240px] h-[240px] object-contain" />
            </div>
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              <p className="text-[14px] text-[#222] tracking-[-0.28px] leading-[1.3]">
                Be the first. It takes 30 seconds.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="text-[14px] font-medium text-[#222] underline underline-offset-2 tracking-[-0.28px] leading-[1.3]"
              >
                View details
              </button>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
            >
              <IconParcel size={16} />
              Add your bag
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[160/90] rounded-[8px] bg-[#f1f1f1]" />
                      <div className="h-3 bg-[#f1f1f1] rounded mt-2 w-3/4" />
                    </div>
                  ))
                : displayed.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-2 bg-[#f7f7f7] border border-[#e5e5e5] rounded-[10px] h-9 pl-3 pr-2 py-2 text-base font-semibold text-[#222] tracking-[-0.16px]"
                >
                  See more
                  <IconArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA banner ───────────────────────────────────── */}
      {!isEmpty && (
      <div className="border-t border-[#f1f1f1] pt-5 pb-12 px-5">
        <div className="flex flex-col gap-4">
          {/* Banner image */}
          <div className="aspect-[353/120] rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/About info.png" alt="" className="w-full h-full object-cover" />
          </div>
          {/* Content */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-[20px] font-black text-[#222] leading-[1.3] mb-2">
                Your bag made it? Help others too.
              </h3>
              <p className="text-base text-[#777] leading-[1.4]">
                15 people squinting at identical bags. You can end that, in 30 seconds.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-base font-medium text-[#222] underline underline-offset-2 mt-2"
              >
                View details
                <IconArrowRight size={16} />
              </button>
            </div>
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
            >
              <IconParcel size={16} />
              Add your bag
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* ── Footer ───────────────────────────────────────── */}
      <Footer />

      {/* ── Info modal ───────────────────────────────────── */}
      {showModal && <InfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const thumb = restaurant.packagingEntries[0]?.photoUrl;
  const count = restaurant._count.packagingEntries;

  return (
    <Link href={`/restaurant/${restaurant.slug}`} className="block group">
      <div className="aspect-[160/90] rounded-[8px] overflow-hidden bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)]">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconParcel size={24} className="text-[#ccc]" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-[12px] font-bold text-[#222] tracking-[-0.24px] leading-[1.3] truncate">
          {restaurant.name}
        </span>
        <span className="text-[12px] font-medium text-[#777] tracking-[-0.24px] ml-2 shrink-0">
          {count}
        </span>
      </div>
    </Link>
  );
}
