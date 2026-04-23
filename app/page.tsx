"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Ingresa tu nombre y apellido.");
    if (!email.trim() || !email.includes("@")) return setError("Ingresa un correo válido.");
    if (!accepted) return setError("Debes aceptar los términos y condiciones.");
    const guestData = { name: name.trim(), email: email.trim() };
    localStorage.setItem("htch_guest", JSON.stringify(guestData));
    // Log guest login (best-effort, do not block navigation)
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", module: null, actorName: guestData.name, actorEmail: guestData.email, details: "Guest inició sesión en la PWA" }),
    }).catch(() => {});
    router.push("/huespedes");
  };

  return (
    <div className="relative min-h-svh w-full max-w-[480px] mx-auto overflow-hidden flex flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/login-bg.jpg')` }}
      />
      {/* Gradient: dark top for logo, lighter mid, darker bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Logo */}
      <div className="relative z-10 pt-12 flex justify-center">
        <img src="/images/logo.png" alt="Hotel Termas de Chillán" className="h-16 object-contain drop-shadow-lg" />
      </div>

      {/* Form — sin card, directo sobre la imagen */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pt-10 pb-4">
        <p className="font-playfair text-white text-[22px] font-bold text-center leading-snug mb-8 drop-shadow">
          Para iniciar tu viaje,<br />por favor ingresa los<br />siguientes datos:
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            className="w-full bg-white/90 rounded-full px-5 py-3 text-[14px] text-[#3D2B1F] placeholder-[#9B9280] outline-none focus:bg-white transition"
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="w-full bg-white/90 rounded-full px-5 py-3 text-[14px] text-[#3D2B1F] placeholder-[#9B9280] outline-none focus:bg-white transition"
          />
          <label className="flex items-center gap-3 cursor-pointer mt-1">
            <div className="relative shrink-0">
              <input type="checkbox" checked={accepted} onChange={(e) => { setAccepted(e.target.checked); setError(""); }} className="sr-only" />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${accepted ? "bg-[#1B4332] border-[#1B4332]" : "border-white/60 bg-white/20"}`}>
                {accepted && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
            <span className="text-[12px] text-white/80">Leí y acepto los términos y condiciones.</span>
          </label>
          {error && <p className="text-red-300 text-[12px] text-center">{error}</p>}
          <button
            type="submit"
            className="mx-auto mt-2 bg-[#1B4332] text-white rounded-full px-12 py-3 font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-lg"
          >
            Comenzar
          </button>
        </form>
      </div>

      <div className="relative z-10 text-center pb-8">
        <a href="/admin/login" className="text-white/40 text-[11px] underline underline-offset-2">
          Acceso administradores
        </a>
      </div>
    </div>
  );
}
