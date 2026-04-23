"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setError("Credenciales incorrectas.");
    router.push("/admin");
  };

  return (
    <div className="min-h-svh bg-[#1B4332] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">Hotel</span>
              <span className="text-white font-bold text-[15px] tracking-widest uppercase">Termas</span>
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">Chillán</span>
            </div>
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
              <path d="M3 35L13 13L20 25L27 15L37 35H3Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="font-playfair text-[#1B4332] text-[22px] font-bold text-center mb-6">Panel Administrador</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#7B6354] mb-1 block">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#E0D8CC] rounded-xl px-4 py-3 text-[14px] text-[#3D2B1F] outline-none focus:border-[#1B4332] transition"
                placeholder="admin@hotel.cl"
                required
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#7B6354] mb-1 block">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-[#E0D8CC] rounded-xl px-4 py-3 text-[14px] text-[#3D2B1F] outline-none focus:border-[#1B4332] transition"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-[12px] text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4332] text-white rounded-xl py-3.5 font-semibold text-[15px] mt-1 disabled:opacity-60 active:scale-[0.98] transition-transform"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
        <p className="text-white/40 text-[11px] text-center mt-6">
          <a href="/" className="underline">← Volver al inicio de huéspedes</a>
        </p>
      </div>
    </div>
  );
}
