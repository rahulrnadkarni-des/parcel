import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-sm">Parcel Admin</span>
        <nav className="flex gap-6 text-sm text-stone-500">
          <Link href="/admin/queue" className="hover:text-black">Queue</Link>
          <Link href="/admin/approved" className="hover:text-black">Approved</Link>
          <Link href="/admin/rejected" className="hover:text-black">Rejected</Link>
        </nav>
        <SignOutButton />
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
