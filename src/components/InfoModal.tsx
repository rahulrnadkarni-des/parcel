"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconClose, IconParcel } from "./icons";

interface InfoModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    label: "Step 1",
    title: "Photograph the bag (not the biryani)",
    body: "Just add the outer packaging. The sad, counter-sitting bag. That one.",
    image: "/assets/Step 1.png",
  },
  {
    label: "Step 2",
    title: "Which restaurant, though?",
    body: "Search for your restaurant. If not listed, add them. Someone's got to be first.",
    image: "/assets/Step 2.png",
  },
  {
    label: "Step 3",
    title: "Locality, please. Bangalore is huge.",
    body: "Select the area. HSR people don't need to know what Whitefield is ordering.",
    image: "/assets/Step 3.png",
  },
  {
    label: "Step 4",
    title: "Just chill",
    body: "We'll scan for accidental secrets. If just a boring bag, it goes live in 24 hours.",
    image: "/assets/Step 4.png",
  },
];

export function InfoModal({ onClose }: InfoModalProps) {
  const [visible, setVisible] = useState(false);

  // Trigger slide-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    // Wait for slide-out transition before unmounting
    setTimeout(onClose, 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Scrim — fades in/out with sheet */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Sheet — slides up from bottom */}
      <div
        className="relative bg-white rounded-t-[20px] shadow-[0_-4px_5px_rgba(0,0,0,0.4)] max-w-[480px] w-full mx-auto max-h-[92vh] flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-[15.5px] z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <IconClose size={20} className="text-white" />
        </button>

        <div className="overflow-y-auto flex-1 pt-2 px-2">
          {/* Banner image */}
          <div className="aspect-[353/120] rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.15)] mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/About info.png" alt="" className="w-full h-full object-cover" />
          </div>

          {/* Heading */}
          <h2 className="text-[24px] font-black text-[#222] leading-[1.3] px-3 mb-4">
            How to add your parcel
          </h2>

          {/* Steps */}
          <div className="px-3 pb-3">
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  {/* Icon column */}
                  <div className="flex flex-col items-center w-16 shrink-0 pb-1">
                    <div className="w-16 h-16 rounded-[8px] overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={step.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    {!isLast && (
                      <div className="flex-1 mt-1 border-l-[1.5px] border-dashed border-[#e5e5e5] min-h-[20px]" />
                    )}
                  </div>

                  {/* Text column */}
                  <div className={`flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                    <p className="text-[10px] font-bold text-[#777] leading-[1.6] tracking-[-0.2px] mb-0.5 uppercase">
                      {step.label}
                    </p>
                    <p className="text-[14px] font-bold text-[#222] leading-[1.3] mb-1">
                      {step.title}
                    </p>
                    <p className="text-[14px] text-[#777] leading-[1.4]">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA button */}
        <div className="shrink-0">
          <div className="pb-12 pt-5 px-5">
            <Link
              href="/submit"
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full h-12 bg-[#222] text-white rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)]"
            >
              <IconParcel size={16} />
              Add your bag
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
