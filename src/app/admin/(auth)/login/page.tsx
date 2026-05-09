"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/queue");
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl p-8">
        <h1 className="text-xl font-semibold mb-1">Parcel Admin</h1>
        <p className="text-stone-500 text-sm mb-6">Enter your password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
