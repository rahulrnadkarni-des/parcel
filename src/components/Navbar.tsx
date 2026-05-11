"use client";

import Link from "next/link";
import { IconParcel } from "./icons";

type NavbarVariant = "hero" | "white" | "form";

export function Navbar({ variant = "white" }: { variant?: NavbarVariant }) {
  const isHero = variant === "hero";
  const isForm = variant === "form";

  return (
    <nav
      className={`flex items-center justify-between h-16 shrink-0 px-5 py-2 ${
        isHero ? "" : "bg-white border-b border-[#e5e5e5]"
      }`}
    >
      <Link
        href="/"
        className={`text-[20px] font-black leading-none ${isHero ? "text-white" : "text-[#222]"}`}
      >
        Parcel.
      </Link>

      {!isForm && (
        <Link
          href="/submit"
          className={`flex items-center gap-2 h-9 pl-2 pr-3 py-2 rounded-[10px] text-base font-semibold tracking-[-0.16px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.15)] whitespace-nowrap ${
            isHero ? "bg-white text-[#222]" : "bg-[#222] text-white"
          }`}
        >
          <IconParcel size={16} />
          Add your bag
        </Link>
      )}
    </nav>
  );
}
