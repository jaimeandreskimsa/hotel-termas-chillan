"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const RESTAURANTS = [
  { key: "arboleda",  href: "/restaurantes/arboleda",  label: "Arboleda",    desc: "Restaurante principal · Vinos & Fine Dining", defaultImg: "/images/arboleda.jpg" },
  { key: "lagrieta",  href: "/restaurantes/la-grieta", label: "La Grieta",   desc: "Bar & comida informal · Cócteles & Música",   defaultImg: "/images/lagrieta.jpg" },
  { key: "muffin",    href: "/restaurantes/muffin",    label: "Muffin Café", desc: "Cafetería · Pastelería & Bebidas",            defaultImg: "/images/muffin.jpg" },
];

export default function RestaurantesPage() {
  const [imgs, setImgs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/familia").then(r => r.json()).then(d => {
      const map: Record<string, string> = {};
      (d.programs ?? []).forEach((p: { type: string; image: string | null }) => {
        const match = p.type.match(/^hero_rest_(.+)$/);
        if (match && p.image) map[match[1]] = p.image;
      });
      setImgs(map);
    });
  }, []);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-16 pb-24">
        <div className="px-5 py-6">
          <h1 className="font-playfair text-[#1B4332] text-[32px] font-bold text-center mb-6">
            Nuestros Restaurantes
          </h1>
          <div className="flex flex-col gap-4">
            {RESTAURANTS.map((r) => (
              <Link key={r.href} href={r.href}>
                <div className="relative h-44 rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform">
                  <img src={imgs[r.key] ?? r.defaultImg} alt={r.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-playfair text-white text-2xl font-bold">{r.label}</h2>
                    <p className="text-white/80 text-[12px] mt-0.5">{r.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
