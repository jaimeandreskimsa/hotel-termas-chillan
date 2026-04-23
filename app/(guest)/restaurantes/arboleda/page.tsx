"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryTabs from "@/components/CategoryTabs";
import PageHero from "@/components/PageHero";

interface Item { id: number; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; }

const CATEGORIES = ["Vinos", "Bebidas Calientes"];

export default function ArboledaPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/restaurantes/arboleda").then(r => r.json()).then(d => setItems(d.items ?? []));
  }, []);

  const filtered = items.filter(i => i.category === activeCategory);
  const bySubcategory = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.subcategory ?? "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14">
        <PageHero title="Arboleda" imageSrc="/images/arboleda.jpg" height="h-[378px]" />
        <CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

        <div className="px-4 py-5 pb-24 flex flex-col gap-4">
          {Object.entries(bySubcategory).map(([sub, subItems]) => (
            <div key={sub}>
              <h3 className="font-playfair text-[#1B4332] text-[18px] font-bold mb-3">{sub}</h3>
              <div className="flex flex-col gap-2">
                {subItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl px-4 py-3 border border-[#EDE6D8] shadow-sm flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-[#3D2B1F] text-[14px] font-medium">{item.name}</p>
                      {item.description && <p className="text-[#9B9280] text-[12px] mt-0.5">{item.description}</p>}
                    </div>
                    {item.price && (
                      <span className="text-[#1B4332] font-semibold text-[13px] shrink-0">{item.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(bySubcategory).length === 0 && (
            <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando menú...</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
