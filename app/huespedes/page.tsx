"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HuespedEntry {
  name: string;
  email: string;
}

export default function HuespedesPage() {
  const router = useRouter();
  const [huespedes, setHuespedes] = useState<HuespedEntry[]>([{ name: "", email: "" }]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Pre-fill Huésped Nº1 with the main guest's data
  useEffect(() => {
    const stored = localStorage.getItem("htch_guest");
    if (!stored) { router.replace("/"); return; }
    const { name, email } = JSON.parse(stored);
    setHuespedes([{ name: name ?? "", email: email ?? "" }]);
  }, [router]);

  const addHuesped = () => {
    setHuespedes(prev => [...prev, { name: "", email: "" }]);
  };

  const removeHuesped = (index: number) => {
    setHuespedes(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const updateHuesped = (index: number, field: keyof HuespedEntry, value: string) => {
    setHuespedes(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
    setErrors(prev => { const next = { ...prev }; delete next[index]; return next; });
  };

  const handleContinue = () => {
    const newErrors: Record<number, string> = {};
    huespedes.forEach((h, i) => {
      if (!h.name.trim()) newErrors[i] = "El nombre es requerido";
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    // Save companions (all except main guest who is already in htch_guest)
    const companions = huespedes.slice(1).filter(h => h.name.trim());
    localStorage.setItem("htch_companions", JSON.stringify(companions));

    // Update main guest with the (possibly edited) first entry
    const main = huespedes[0];
    const stored = localStorage.getItem("htch_guest");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem("htch_guest", JSON.stringify({ ...parsed, name: main.name, email: main.email }));
    }

    router.push("/home");
  };

  const handleSkip = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-svh bg-[#F5F0E8] flex flex-col max-w-[480px] mx-auto">
      {/* Header */}
      <header className="bg-[#1B4332] flex items-center justify-between px-4 py-3 sticky top-0 z-10">
        <img src="/images/logo.png" alt="Hotel Termas de Chillán" className="h-10 object-contain" />
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
          <span className="text-lg">🇨🇱</span>
          <span className="text-white text-[13px] font-semibold">ESP</span>
        </div>
      </header>

      <div className="flex-1 px-5 pt-8 pb-10">
        <h1 className="font-playfair text-[#1B4332] text-[28px] font-bold text-center leading-snug mb-8">
          Para mejorar tu<br />experiencia, completa<br />los siguientes datos de<br />los huéspedes:
        </h1>

        <div className="flex flex-col gap-5">
          {huespedes.map((h, i) => (
            <div key={i} className="bg-[#EDE6D8] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-playfair text-[#1B4332] text-[17px] font-bold">
                  Huésped N°{i + 1}
                </h2>
                {i > 0 && (
                  <button
                    onClick={() => removeHuesped(i)}
                    className="text-red-500 text-[12px] font-semibold flex items-center gap-1 active:opacity-70"
                  >
                    <span className="text-[16px] leading-none">×</span> Eliminar
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombre del Huésped"
                    value={h.name}
                    onChange={e => updateHuesped(i, "name", e.target.value)}
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-[14px] text-[#3D2B1F] placeholder-[#9B9280] outline-none border border-transparent focus:border-[#1B4332] transition"
                  />
                  {errors[i] && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[11px] font-semibold">
                      Requerido
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={h.email}
                  onChange={e => updateHuesped(i, "email", e.target.value)}
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-[14px] text-[#3D2B1F] placeholder-[#9B9280] outline-none border border-transparent focus:border-[#1B4332] transition"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add guest button */}
        <button
          onClick={addHuesped}
          className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1B4332]/40 rounded-2xl py-3.5 text-[#1B4332] text-[14px] font-semibold active:opacity-70 transition"
        >
          <span className="text-[20px] leading-none">+</span>
          Agregar huésped
        </button>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="mt-6 w-full bg-[#1B4332] text-white rounded-full py-3.5 font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-lg"
        >
          Continuar
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="mt-3 w-full text-[#9B9280] text-[13px] text-center active:opacity-70"
        >
          Omitir por ahora
        </button>
      </div>
    </div>
  );
}
