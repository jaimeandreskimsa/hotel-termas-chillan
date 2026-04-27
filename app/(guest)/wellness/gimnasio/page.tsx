"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface GymClass { id: number; name: string; description: string | null; price: string | null; schedule: string | null; }

export default function GimnasioPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [heroImg, setHeroImg] = useState("/images/gimnasio.jpg");

  useEffect(() => {
    fetch("/api/gym/classes").then(r => r.json()).then(d => setClasses(d.classes ?? []));
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_gimnasio");
      if (hero?.image) setHeroImg(hero.image);
    });
  }, []);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14">
        <div className="relative overflow-hidden shadow-lg" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImg}')` }} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Gimnasio</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
          </div>
        </div>

        <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
          {/* Hours */}
          <div className="bg-white rounded-2xl p-4 border border-[#EDE6D8]">
            <p className="font-semibold text-[#1B4332] text-[14px] mb-1">Horarios de Atención:</p>
            <p className="text-[13px] text-[#3D2B1F]">Horario Continuo</p>
          </div>

          {/* Classes */}
          <h2 className="font-playfair text-[#1B4332] text-[22px] font-bold">Fitness y Clases</h2>
          {classes.length > 0 ? (
            classes.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-[#EDE6D8] shadow-sm">
                <h3 className="font-semibold text-[#1B4332] text-[15px] mb-1">{c.name}</h3>
                {c.description && <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-2">{c.description}</p>}
                <div className="flex items-center gap-4">
                  {c.schedule && (
                    <div className="flex items-center gap-1.5 text-[#7B6354]">
                    <i className="fi-rs-clock-three" style={{ fontSize: 13 }} />
                      <span className="text-[12px] font-medium">{c.schedule}</span>
                    </div>
                  )}
                  {c.price && (
                    <div className="flex items-center gap-1.5 text-[#1B4332]">
                    <i className="fi-rs-usd-circle" style={{ fontSize: 13 }} />
                      <span className="text-[12px] font-semibold">{c.price}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#9B9280] text-center py-6 text-[14px]">Cargando clases...</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
