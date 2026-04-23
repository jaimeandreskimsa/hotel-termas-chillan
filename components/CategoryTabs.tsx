"use client";
import { useRef } from "react";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-[#1B4332]"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
            active === cat
              ? "bg-white text-[#1B4332]"
              : "bg-transparent text-white border border-white/50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
