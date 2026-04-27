"use client";
import { useRef } from "react";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  bg?: string;
}

export default function CategoryTabs({ categories, active, onChange, bg = "bg-[#1B4332]" }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${bg} px-4 py-3`}>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar md:justify-center"
      >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
            active === cat
              ? bg === "bg-[#1B4332]" ? "bg-white text-[#1B4332]" : "bg-[#1B4332] text-white"
              : bg === "bg-[#1B4332]" ? "bg-transparent text-white border border-white/50" : "bg-transparent text-[#1B4332] border border-[#1B4332]/40"
          }`}
        >
          {cat}
        </button>
      ))}
      </div>
    </div>
  );
}
