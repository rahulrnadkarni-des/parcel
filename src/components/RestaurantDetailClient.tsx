"use client";

import { useState } from "react";
import Link from "next/link";
import { InfoModal } from "./InfoModal";
import { IconArrowRight, IconParcel } from "./icons";

export function RestaurantDetailClient({ restaurantName }: { restaurantName: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
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
                Doesn&apos;t match your parcel?
              </h3>
              <p className="text-base text-[#777] leading-[1.4]">
                Share it here to help others recognize it too.
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
              Add your parcel
            </Link>
          </div>
        </div>
      </div>

      {showModal && <InfoModal onClose={() => setShowModal(false)} />}
    </>
  );
}
