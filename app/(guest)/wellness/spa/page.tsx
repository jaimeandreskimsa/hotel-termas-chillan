"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

interface SpaService { id: number; category: string; name: string; description: string | null; duration: string | null; price: string | null; }
interface Schedule { venue: string; hours: string; }

const CATEGORIES = ["Masajes y Terapias", "Rituales de Renovación", "Faciales y Jacuzzi", "Peluquería y Manicure", "Circuitos de Agua"];

export default function SpaPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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
      {/* Header con tabs integrados */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-[#1B4332]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home">
            <img src="/images/logo.png" alt="Hotel Termas de Chillán" className="h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇨🇱</span>
              <span className="text-white text-xs font-semibold tracking-wide">ESP</span>
            </div>
            <button onClick={() => setMenuOpen(true)} className="text-white p-1" aria-label="Abrir menú">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="18" height="1.8" rx="0.9" fill="white"/>
                <rect x="2" y="10.1" width="18" height="1.8" rx="0.9" fill="white"/>
                <rect x="2" y="15.2" width="18" height="1.8" rx="0.9" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 pb-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? "bg-white text-[#1B4332]" : "text-white/80"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Top dropdown menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#1B4332] flex flex-col rounded-b-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <img src="/images/logo.png" alt="Hotel Termas de Chillán" className="h-10 w-auto object-contain" />
              <button onClick={() => setMenuOpen(false)} className="text-white p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <nav>
              {[
                { href: "/home",         label: "Inicio",                       iconClass: "fi-ts-house-blank" },
                { href: "/habitacion",   label: "Mi habitación",                iconClass: "fi-ts-bed-alt" },
                { href: "/restaurantes", label: "Comer y Beber",                iconClass: "fi-ts-utensils" },
                { href: "/actividades",  label: "Experiencias",                 iconClass: "fi-ts-mountain" },
                { href: "/wellness",     label: "Wellness & Spa",               iconClass: "fi-ts-hot-tub" },
                { href: "/familia",      label: "Familia y Niños",              iconClass: "fi-ts-family" },
                { href: "/emergencia",   label: "Contacto de Emergencia",       iconClass: "fi-rs-phone-call" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-5 px-6 py-[18px] border-b border-white/15 active:bg-white/10">
                  <i className={`${item.iconClass} text-white shrink-0`} style={{ fontSize: 22 }} />
                  <span className="text-white font-playfair text-[20px]">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero con curva en la parte inferior */}
      <div className="pt-[104px]">
        <div className="relative overflow-hidden h-[378px] shadow-lg rounded-b-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-6">
            <h1 className="font-playfair text-white text-[32px] font-bold drop-shadow">Spa Alunco</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 py-5 pb-24 flex flex-col gap-4">
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
