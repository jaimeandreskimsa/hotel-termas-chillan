"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface SpaService { id: number; category: string; name: string; description: string | null; duration: string | null; price: string | null; }
interface Schedule { venue: string; hours: string; }

const CATEGORIES = ["Masajes y Terapias", "Rituales de Renovación", "Faciales y Jacuzzi", "Peluquería y Manicure", "Circuitos de Agua"];

export default function SpaPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [heroImg, setHeroImg] = useState("/images/spa.jpg");

  useEffect(() => {
    fetch("/api/spa/services").then(r => r.json()).then(d => setServices(d.services ?? []));
    fetch("/api/spa/schedules").then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_spa");
      if (hero?.image) setHeroImg(hero.image);
    });
  }, []);

  const filtered = services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />

      {/* Category tabs — fixed on mobile, static below hero on desktop */}
      <div className="fixed md:hidden top-[64px] left-0 right-0 z-40 bg-[#1B4332]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? "bg-white text-[#1B4332]" : "text-white/80 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="pt-[104px] md:pt-[64px]">
        <div className="relative overflow-hidden shadow-lg md:rounded-none" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImg}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Spa Alunco</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
          </div>
        </div>
      </div>

      {/* Category tabs — desktop only, below hero */}
      <div className="hidden md:block bg-[#1B4332]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-3 max-w-7xl mx-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? "bg-white text-[#1B4332]" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
        {/* Horarios */}
        {schedules.length > 0 && (
          <div className="bg-[#FFFDF6] rounded-2xl p-4 border border-[#EDE6D8]">
            <p className="font-bold text-[#3D2B1F] text-[15px] mb-2">Horarios de Atención:</p>
            {schedules.map((s) => (
              <p key={s.venue} className="text-[14px] text-[#3D2B1F] leading-relaxed">
                <span className="font-bold">{s.venue}:</span> {s.hours}
              </p>
            ))}
            <div className="border-t border-[#EDE6D8] mt-3 pt-3 flex items-start gap-2">
              <i className="fi-rs-calendar text-[#C8963E] mt-0.5 shrink-0" style={{ fontSize: 14 }} />
              <p className="text-[12px] text-[#7B6354]">Para agendar, llama al 3544 desde tu habitación o acércate a la recepción del Spa.</p>
            </div>
          </div>
        )}

        {/* Título sección */}
        <h2 className="font-playfair text-[#3D2B1F] text-[24px] font-bold text-center mt-1">{activeCategory}</h2>

        {/* Servicios */}
        {filtered.length > 0 ? filtered.map(service => (
          <div key={service.id} className="bg-[#FFFDF6] rounded-2xl p-4 border border-[#EDE6D8] shadow-sm">
            <h3 className="font-bold text-[#3D2B1F] text-[15px] mb-1">{service.name}</h3>
            {service.description && (
              <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-3">{service.description}</p>
            )}
            <div className="flex items-center gap-4">
              {service.price && (
                <div className="flex items-center gap-1.5 text-[#C8963E]">
                  <i className="fi-rs-usd-circle" style={{ fontSize: 14 }} />
                  <span className="text-[13px] font-semibold">{service.price}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1.5 text-[#7B6354]">
                  <i className="fi-rs-clock-three" style={{ fontSize: 14 }} />
                  <span className="text-[13px]">{service.duration}</span>
                </div>
              )}
            </div>
          </div>
        )) : (
          <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando servicios...</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
