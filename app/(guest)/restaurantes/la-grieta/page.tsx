"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryTabs from "@/components/CategoryTabs";
import PageHero from "@/components/PageHero";

interface Item { id: number; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; }

const CATEGORIES = ["Hamburguesas", "Sándwiches", "Fast Food", "Tablas", "Ensaladas", "Coctelería", "Destilados y Licores", "Cervezas y Sin Alcohol"];

export default function LaGrietaPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/restaurantes/lagrieta").then(r => r.json()).then(d => setItems(d.items ?? []));
  }, []);

  const filtered = items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14">
        <PageHero title="La Grieta" imageSrc="/images/lagrieta.jpg" height="h-[378px]" />
        <CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

        <div className="px-4 py-5 pb-24 flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-[#EDE6D8] shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-[#1B4332] text-[15px] flex-1">{item.name}</h3>
                  {item.price && <span className="text-[#1B4332] font-semibold text-[13px] shrink-0">{item.price}</span>}
                </div>
                {item.description && <p className="text-[#6B6B6B] text-[13px] mt-1 leading-relaxed">{item.description}</p>}
                {item.subcategory && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-[#EDE6D8] rounded-full text-[11px] text-[#7B6354] font-medium">{item.subcategory}</span>
                )}
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
