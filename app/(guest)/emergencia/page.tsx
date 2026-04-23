"use client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-28">
        <div className="w-full max-w-sm bg-[#EDE8E3] rounded-2xl p-8 shadow-sm text-center">
          <h1 className="font-playfair text-[32px] font-bold text-[#2D2D2D] mb-6 underline decoration-2 underline-offset-4">
            Emergencia
          </h1>

          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-5">
            Si necesitas atención médica inmediata,<br />
            comunícate con la recepción llamando al:
          </p>

          <a
            href="tel:3500"
            className="inline-block bg-[#B85C45] text-white font-semibold text-lg px-10 py-3 rounded-full mb-8 active:opacity-80"
          >
            3500
          </a>

          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-5">
            Si te encuentras fuera del Hotel, llama al:
          </p>

          <a
            href="tel:+5622322 3500"
            className="inline-block bg-[#B85C45] text-white font-semibold text-lg px-8 py-3 rounded-full active:opacity-80"
          >
            +562 2322 3500
          </a>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
