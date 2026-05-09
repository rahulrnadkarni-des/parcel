"use client";

import { useState } from "react";

interface Entry {
  id: string;
  photoUrl: string;
  area: { name: string; slug: string };
}

export function RestaurantPhotoGrid({ entries }: { entries: Entry[] }) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const areas = Array.from(
    new Map(entries.map((e) => [e.area.slug, e.area])).values()
  );

  const filtered = selectedArea
    ? entries.filter((e) => e.area.slug === selectedArea)
    : entries;

  return (
    <div>
      {areas.length > 1 && (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-3 pt-3 pb-3 w-max">
            {areas.map((area) => {
              const active = selectedArea === area.slug;
              return (
                <button
                  key={area.slug}
                  onClick={() => setSelectedArea(active ? null : area.slug)}
                  className={`flex items-center gap-1.5 rounded-full whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#222] h-8 pl-3 pr-[6px] py-2 text-[12px] font-medium text-white"
                      : "bg-white border border-[#e5e5e5] px-3 py-2 text-[12px] text-[#999]"
                  }`}
                >
                  {area.name}
                  {active && (
                    <span className="bg-white/15 p-1 rounded-full leading-none text-[10px]">✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-[8px] overflow-hidden bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.photoUrl} alt="Packaging" className="w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
