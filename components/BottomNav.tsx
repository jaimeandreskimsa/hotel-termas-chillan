"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  guestName?: string;
}

export default function BottomNav({ guestName }: BottomNavProps) {
  const pathname = usePathname();
  const initials = guestName
    ? guestName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 bg-[#1B4332] flex items-center justify-around px-6 py-2"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      <Link href="/home" className="flex flex-col items-center gap-0.5 p-2 text-white/80">
        <i className="fi-ts-house-blank" style={{ fontSize: 22 }} />
      </Link>

      {/* Center profile button */}
      <Link href="/home" className="relative -top-4">
        <div className="w-14 h-14 rounded-full bg-[#2D6A50] flex items-center justify-center shadow-lg border-4 border-[#1B4332]">
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>
      </Link>

      <Link href="/wellness" className="flex flex-col items-center gap-0.5 p-2 text-white/80">
        <i className="fi-rs-search" style={{ fontSize: 22 }} />
      </Link>
    </nav>
  );
}
