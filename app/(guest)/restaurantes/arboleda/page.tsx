"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryTabs from "@/components/CategoryTabs";

interface Item { id: number; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; }
interface Schedule { id: number; info: string; }

export default function ArboledaPage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/restaurantes/arboleda").then(r => r.json()).then(d => {
      const loaded = d.items ?? [];
      setItems(loaded);
      if (loaded.length > 0) setActiveCategory(loaded[0].category);
    });
    fetch("/api/restaurantes/schedules?restaurant=arboleda").then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
  }, []);

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const filtered = items.filter(i => i.category === activeCategory);
  const bySubcategory = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.subcategory ?? "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />
      <div>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ width: '100%', height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <img src="/images/arboleda.jpg" alt="Arboleda" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          {/* Title centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Arboleda</h1>
          </div>
          {/* Volver button bottom center */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
          </div>
        </div>
        {schedules.length > 0 && (
          <div className="px-4 py-3 bg-white border-b border-[#EDE6D8] text-center">
            <p className="text-[#1B4332] text-[12px] font-semibold uppercase tracking-wide mb-1">Horarios</p>
            {schedules.map(s => (
              <p key={s.id} className="text-[#4A4A4A] text-[13px]">{s.info}</p>
            ))}
          </div>
        )}
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} bg="bg-transparent" />

        <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
          {Object.entries(bySubcategory).map(([sub, subItems]) => (
            <div key={sub}>
              <h3 className="font-playfair font-bold text-[#54432B] text-[32px] leading-none text-center mb-3">{sub}</h3>
              <div className="flex flex-col gap-2">
                {subItems.map(item => (
                  <div key={item.id} className="bg-[#F3EDE4] rounded-2xl px-4 py-3 border border-[#EDE6D8] shadow-sm flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-[#3D2B1F] text-[14px] font-medium">{item.name}</p>
                      {item.description && <p className="text-[#9B9280] text-[12px] mt-0.5">{item.description}</p>}
                    </div>
                    {item.price && (
                      <span className="shrink-0" style={{ fontFamily: 'Cooper Hewitt, sans-serif', fontWeight: 705, fontSize: 15, lineHeight: 1, color: '#54432B' }}>{item.price}</span>
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
