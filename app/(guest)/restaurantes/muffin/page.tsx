"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryTabs from "@/components/CategoryTabs";

interface Item { id: number; category: string; name: string; price: string | null; }
interface Schedule { id: number; info: string; }

const CATEGORIES = ["Pastelería", "Bebidas Calientes", "Bebidas Frías"];

export default function MuffinPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/restaurantes/muffin").then(r => r.json()).then(d => setItems(d.items ?? []));
    fetch("/api/restaurantes/schedules?restaurant=muffin").then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
  }, []);

  const filtered = items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14">
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ width: '100%', height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <img src="/images/muffin.jpg" alt="Muffin Café" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Muffin Café</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
          </div>
        </div>
        {schedules.length > 0 && (
          <div className="px-4 py-3 bg-white border-b border-[#EDE6D8]">
            <p className="text-[#1B4332] text-[12px] font-semibold uppercase tracking-wide mb-1">Horarios</p>
            {schedules.map(s => (
              <p key={s.id} className="text-[#4A4A4A] text-[13px]">{s.info}</p>
            ))}
          </div>
        )}
        <CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} bg="bg-transparent" />

        <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-2 md:max-w-3xl md:mx-auto">
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
