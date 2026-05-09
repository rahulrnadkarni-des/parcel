"use client";

import { useMarkBackward } from "@/lib/navigation";
import { IconArrowLeft } from "./icons";
import Link from "next/link";

export function BackHomeLink() {
  const markBackward = useMarkBackward();
  return (
    <Link
      href="/"
      onClick={markBackward}
      className="flex items-center gap-1 text-[12px] font-semibold text-[#777] tracking-[-0.12px] hover:text-[#222] transition-colors mb-5"
    >
      <IconArrowLeft size={12} />
      Back home
    </Link>
  );
}
