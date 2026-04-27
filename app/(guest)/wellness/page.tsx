"use client";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const sections = [
  {
    href: "/wellness/spa",
    label: "Spa Alunco",
    image: "/images/spa.jpg",
    desc: "Masajes, rituales, faciales y circuitos",
  },
  {
    href: "/wellness/gimnasio",
    label: "Gimnasio",
    image: "/images/gimnasio.jpg",
    desc: "Clases, fitness y activación corporal",
  },
];

export default function WellnessPage() {
  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-16 page-pb">
        <div className="px-5 py-6">
          <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
            Wellness &amp; Spa
          </h1>
          <div className="flex flex-col items-center" style={{ gap: 46 }}>
            {sections.map((s) => (
              <Link key={s.href} href={s.href}>
                <div className="relative overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter" style={{ width: 382, height: 114, borderRadius: 24 }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="font-playfair text-white font-bold text-center" style={{ fontSize: 24, lineHeight: 1 }}>{s.label}</h2>
                  </div>
                </div>
              </Link>
            ))}
            <button onClick={() => window.history.back()} className="bg-[#1B4332] text-white px-6 py-2 rounded-full text-[14px] font-semibold active:opacity-80">Volver</button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
