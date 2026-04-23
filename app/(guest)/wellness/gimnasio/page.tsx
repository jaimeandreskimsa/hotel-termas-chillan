"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PageHero from "@/components/PageHero";

interface GymClass { id: number; name: string; description: string | null; price: string | null; schedule: string | null; }

export default function GimnasioPage() {
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
        <PageHero
          title="Gimnasio"
          imageSrc={heroImg}
          height="h-[378px]"
        />

        <div className="px-4 py-5 pb-24 flex flex-col gap-4">
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
