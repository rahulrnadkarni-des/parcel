"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft } from "./icons";

export function BackHomeLink() {
  const router = useRouter();

  function handleClick() {
    const el = document.getElementById("page-slide-root");
    if (el) {
      el.style.transition = "transform 320ms ease-in";
      el.style.transform = "translateX(100%)";
    }
    sessionStorage.setItem("homeFromLeft", "1");
    setTimeout(() => router.push("/"), 320);
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-[12px] font-semibold text-[#777] tracking-[-0.12px] hover:text-[#222] transition-colors mb-5"
    >
      <IconArrowLeft size={12} />
      Back home
    </button>
  );
}
