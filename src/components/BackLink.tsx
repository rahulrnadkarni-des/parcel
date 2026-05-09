"use client";

import Link from "next/link";
import { useMarkBackward } from "@/lib/navigation";

interface BackLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function BackLink({ href, className, children }: BackLinkProps) {
  const markBackward = useMarkBackward();
  return (
    <Link href={href} onClick={markBackward} className={className}>
      {children}
    </Link>
  );
}
