"use client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      <Header />
      <div className="pt-14 pb-28 md:pb-12 md:max-w-2xl md:mx-auto">
        {/* Hero naranja */}
        <div className="relative w-full flex flex-col items-center justify-center rounded-b-3xl" style={{ height: 378, background: "linear-gradient(180deg, #C0553A 0%, #D4722A 100%)" }}>
          <h1 className="text-white drop-shadow-lg mb-6" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1, textAlign: "center" }}>
            Emergencia
          </h1>
        </div>
        {/* Contenido */}
        <div className="flex flex-col items-center gap-5 text-center px-6 py-8">
          <p className="text-[#4A4A4A] text-[14px] leading-relaxed">
            Si necesitas atención médica inmediata,<br />
            comunícate con la recepción llamando al:
          </p>
          <a href="tel:3500" className="inline-block bg-[#B85C45] text-white font-semibold text-[16px] px-10 py-3 rounded-full active:opacity-80">3500</a>
          <p className="text-[#4A4A4A] text-[14px] leading-relaxed">
            Si te encuentras fuera del Hotel, llama al:
          </p>
          <a href="tel:+56223223500" className="inline-block bg-[#B85C45] text-white font-semibold text-[16px] px-8 py-3 rounded-full active:opacity-80">+562 2322 3500</a>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
