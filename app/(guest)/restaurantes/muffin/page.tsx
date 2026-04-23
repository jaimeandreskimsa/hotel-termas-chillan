"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryTabs from "@/components/CategoryTabs";
import PageHero from "@/components/PageHero";

interface Item { id: number; category: string; name: string; price: string | null; }

const CATEGORIES = ["Pastelería", "Bebidas Calientes", "Bebidas Frías"];

export default function MuffinPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/restaurantes/muffin").then(r => r.json()).then(d => setItems(d.items ?? []));
  }, []);

  const filtered = items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14">
        <PageHero title="Muffin Café" imageSrc="/images/muffin.jpg" height="h-[378px]" />
        <CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

        <div className="px-4 py-5 pb-24 flex flex-col gap-2">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.id} className="bg-white rounded-xl px-4 py-3 border border-[#EDE6D8] flex justify-between items-center shadow-sm">
                <span className="text-[#3D2B1F] text-[14px] font-medium">{item.name}</span>
                {item.price && <span className="text-[#1B4332] font-semibold text-[13px]">{item.price}</span>}
              </div>
            ))
          ) : (
            <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando menú...</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
