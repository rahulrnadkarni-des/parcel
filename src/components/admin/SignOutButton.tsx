"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <button onClick={signOut} className="text-sm text-stone-400 hover:text-black">
      Sign out
    </button>
  );
}
