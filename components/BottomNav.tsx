"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 bg-[#1B4332] flex items-center justify-around px-6 py-2 md:hidden"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      <Link href="/home" className="flex flex-col items-center gap-0.5 p-2 text-white/80">
        <i className="fi-ts-house-blank" style={{ fontSize: 22 }} />
      </Link>

      <Link href="/wellness" className="flex flex-col items-center gap-0.5 p-2 text-white/80">
        <i className="fi-rs-search" style={{ fontSize: 22 }} />
      </Link>
    </nav>
  );
}
