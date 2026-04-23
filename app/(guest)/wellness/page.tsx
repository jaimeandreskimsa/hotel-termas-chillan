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
          <h1 className="font-playfair text-[#1B4332] text-[32px] font-bold text-center mb-6">
            Wellness &amp; Spa
          </h1>
          <div className="flex flex-col gap-4">
            {sections.map((s) => (
              <Link key={s.href} href={s.href}>
                <div className="relative h-44 rounded-3xl overflow-hidden shadow-card active:scale-[0.98] transition-transform">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-playfair text-white text-2xl font-bold">{s.label}</h2>
                    <p className="text-white/80 text-[12px] mt-0.5">{s.desc}</p>
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
