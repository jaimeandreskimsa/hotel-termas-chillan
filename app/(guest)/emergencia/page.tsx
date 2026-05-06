"use client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF3] flex flex-col">
      <Header />
      {/* Hero naranja — full width */}
      <div className="relative w-full flex flex-col items-center justify-center rounded-b-3xl" style={{ height: 378, background: "linear-gradient(119.4deg, #AF4E2B 8.15%, #DB7C59 54.08%, #AF4E2B 100%)" }}>
        <h1 className="text-white drop-shadow-lg mb-6" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1, textAlign: "center" }}>
          Emergencia
        </h1>
      </div>
      <div className="pb-28 md:pb-12 md:max-w-2xl md:mx-auto w-full">
        {/* Contenido */}
        <div className="flex flex-col items-center gap-5 text-center px-6 py-8">
          <p className="text-[#4A4A4A] text-[14px] leading-relaxed">
            Si necesitas atención médica inmediata,<br />
            comunícate con la recepción llamando al:
          </p>
          <a href="tel:3500" className="inline-block bg-[#DB7C59] text-white font-semibold text-[16px] px-10 py-3 rounded-full active:opacity-80">3500</a>
          <p className="text-[#4A4A4A] text-[14px] leading-relaxed">
            Si te encuentras fuera del Hotel, llama al:
          </p>
          <a href="tel:+56223223500" className="inline-block bg-[#DB7C59] text-white font-semibold text-[16px] px-8 py-3 rounded-full active:opacity-80">+562 2322 3500</a>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
