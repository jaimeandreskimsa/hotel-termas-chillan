"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Program {
  id: number;
  type: string;
  name: string;
  description: string | null;
  schedule: string | null;
  season: string | null;
  image: string | null;
}

function bulletIcon(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("hora") || t.includes("minuto") || t.includes("duración")) return "fi-ts-clock";
  if (t.includes("altitud") || t.includes("msnm")) return "fi-ts-mountain";
  if (t.includes("dificultad")) return "fi-ts-bolt";
  if (t.includes("km") || t.includes("distancia")) return "fi-ts-route";
  if (t.includes("pasajero") || t.includes("niño") || t.includes("guía") || t.includes("grupo") || t.includes("año")) return "fi-ts-users";
  if (t.includes("reserva") || t.includes("recepción") || t.includes("mesón")) return "fi-ts-info";
  return "fi-ts-check";
}

function extractLines(desc: string | null) {
  if (!desc) return { first: "", bullets: [] as string[] };
  const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
  return { first: lines[0] ?? "", bullets: lines.slice(1, 7) };
}

function ActivityCard({ program, fallbackImage }: { program: Program; fallbackImage: string }) {
  const { first, bullets } = extractLines(program.description);
  const img = program.image ?? fallbackImage;
  return (
    <div className="shrink-0 w-[82vw] max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-sm snap-center">
      <div className="relative h-[245px] w-full bg-gray-200">
        <img src={img} alt={program.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[#1B4332] text-[14px] leading-snug mb-1">{program.name}</h3>
        <p className="text-[#6B6B6B] text-[12px] leading-relaxed mb-2">{first}</p>
        {bullets.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                  <i className={`${bulletIcon(b)} text-[#D4722A]`} style={{ fontSize: 10 }} />
                </span>
                <span className="text-[#3D3D3D] text-[11px] leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        )}
        {program.schedule && (
          <div className="mt-2 flex items-center gap-1.5 text-[#9B9280]">
            <i className="fi-ts-info" style={{ fontSize: 10 }} />
            <span className="text-[11px]">{program.schedule}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ClubCard({ program, fallbackImage }: { program: Program; fallbackImage: string }) {
  const first = program.description?.split("\n")[0] ?? "";
  const img = program.image ?? fallbackImage;
  return (
    <div className="shrink-0 w-[82vw] max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-sm snap-center">
      <div className="relative h-[245px] w-full bg-gray-200">
        <img src={img} alt={program.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[#1B4332] text-[14px] leading-snug mb-1">{program.name}</h3>
        <p className="text-[#6B6B6B] text-[12px] leading-relaxed mb-2">{first}</p>
        {program.schedule && (
          <p className="text-[#D4722A] text-[11px] font-medium">{program.schedule}</p>
        )}
      </div>
    </div>
  );
}

const CATEGORIES = [
  { key: "ninos",     label: "Niños" },
  { key: "guarderia", label: "Guardería" },
];

export default function FamiliaPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [season, setSeason] = useState<"verano" | "invierno">("verano");

  useEffect(() => {
    fetch("/api/familia").then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  }, []);

  const seasonActividades = programs.filter(p => p.type === "actividad" && p.season === season);
  const clubs = programs.filter(p => p.type === "club");
  const guarderiaPrograms = programs.filter(p => p.type === "guarderia");
  const reglamento = programs.find(p => p.type === "reglamento");
  const catNinosImg = programs.find(p => p.type === "cat_ninos")?.image ?? "/images/ninos.jpg";
  const catGuarderiaImg = programs.find(p => p.type === "cat_guarderia")?.image ?? "/images/guarderia.jpg";

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />

      <div className="pt-14">
        {!selected ? (
          /* ── List view ── */
          <div className="flex flex-col">
            <div className="px-5 pt-8 pb-2 text-center">
              <h1 className="font-playfair text-[#1B4332] text-[32px] font-bold leading-tight">
                Familia y Niños
              </h1>
            </div>
            <div className="px-4 py-5 pb-24 flex flex-col gap-4">
              {CATEGORIES.map(cat => {
                const img = cat.key === "ninos" ? catNinosImg : catGuarderiaImg;
                return (
                <button
                  key={cat.key}
                  onClick={() => setSelected(cat.key)}
                  className="w-full relative h-[130px] rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
                >
                  <img src={img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#1B4332]/55" />
                  <span className="absolute inset-0 flex items-center justify-center font-playfair text-white text-[22px] font-bold drop-shadow-md">
                    {cat.label}
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        ) : selected === "ninos" ? (
          /* ── Niños detail ── */
          <div className="pb-24">
            {/* Season toggle */}
            <div className="flex bg-[#1B4332] gap-2 px-4 py-3">
              {(["verano", "invierno"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-all ${season === s ? "bg-white text-[#1B4332]" : "text-white border border-white/40"}`}
                >
                  {s === "verano" ? "☀️ Verano" : "⛷️ Invierno"}
                </button>
              ))}
            </div>
            {/* Hero */}
            <div className="relative h-[220px] w-full rounded-b-3xl overflow-hidden">
              <img src={catNinosImg} alt="Niños" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/65" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1B4332] text-white rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver
              </button>
              <div className="absolute bottom-5 left-0 right-0 text-center px-6">
                <h2 className="font-playfair text-white text-[28px] font-bold drop-shadow-lg">Niños</h2>
              </div>
            </div>

            <div className="flex flex-col gap-7 pt-6">
              {/* Actividades de temporada */}
              {seasonActividades.length > 0 && (
                <div>
                  <h2 className="font-playfair text-[#1B4332] text-[22px] font-bold text-center mb-4 px-4">
                    Actividades de Temporada
                  </h2>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
                    {seasonActividades.map(p => (
                      <ActivityCard key={p.id} program={p} fallbackImage={catNinosImg} />
                    ))}
                    <div className="shrink-0 w-2" />
                  </div>
                </div>
              )}

              {/* Clubs / Actividades permanentes */}
              {clubs.length > 0 && (
                <div>
                  <h2 className="font-playfair text-[#1B4332] text-[22px] font-bold text-center mb-4 px-4">
                    Actividades
                  </h2>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
                    {clubs.map(p => (
                      <ClubCard key={p.id} program={p} fallbackImage={catNinosImg} />
                    ))}
                    <div className="shrink-0 w-2" />
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 mt-8">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 rounded-full border-2 border-[#1B4332] text-[#1B4332] font-semibold text-[14px] flex items-center justify-center gap-2 active:bg-[#1B4332] active:text-white transition-colors"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver a Familia y Niños
              </button>
            </div>
          </div>
        ) : (
          /* ── Guardería detail ── */
          <div className="pb-24">
            {/* Hero */}
            <div className="relative h-[220px] w-full rounded-b-3xl overflow-hidden">
              <img src={catGuarderiaImg} alt="Guardería" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/65" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1B4332] text-white rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver
              </button>
              <div className="absolute bottom-5 left-0 right-0 text-center px-6">
                <h2 className="font-playfair text-white text-[28px] font-bold drop-shadow-lg">Guardería</h2>
              </div>
            </div>

            <div className="px-4 pt-6 flex flex-col gap-4">
              {guarderiaPrograms.length > 0 ? (
                <>
                  {guarderiaPrograms.map(g => (
                    <div key={g.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                      {g.image && (
                        <div className="relative h-[170px]">
                          <img src={g.image} alt={g.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-[#1B4332] text-[16px] mb-1">{g.name}</h3>
                        {g.schedule && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-5 h-5 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                              <i className="fi-ts-clock text-[#D4722A]" style={{ fontSize: 10 }} />
                            </span>
                            <span className="text-[#3D3D3D] text-[13px]">{g.schedule}</span>
                          </div>
                        )}
                        {g.description && (
                          <p className="text-[#6B6B6B] text-[13px] leading-relaxed whitespace-pre-line">
                            {g.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="bg-[#FFF8F0] rounded-2xl p-4 border border-[#F0DCC0] flex gap-3">
                    <i className="fi-ts-info text-[#D4722A] shrink-0 mt-0.5" style={{ fontSize: 16 }} />
                    <div>
                      <p className="text-[#3D2B1F] font-semibold text-[13px] mb-1">Reglamento Guardería</p>
                      <p className="text-[#7B6354] text-[12px] leading-relaxed whitespace-pre-line">
                        {reglamento?.description ?? "Servicio para niños/as de 3 a 7 años con control de esfínter. Menores de 3 años deben estar siempre con un adulto.\nEl ingreso y retiro siempre debe ser con un adulto responsable. Se debe firmar ingreso y entregar información de salud y alergias."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#FFF8F0] rounded-2xl p-4 border border-[#F0DCC0] flex gap-3">
                    <i className="fi-ts-info text-[#D4722A] shrink-0 mt-0.5" style={{ fontSize: 16 }} />
                    <div>
                      <p className="text-[#3D2B1F] font-semibold text-[13px] mb-1">Reglamento Guardería</p>
                      <p className="text-[#7B6354] text-[12px] leading-relaxed whitespace-pre-line">
                        {reglamento?.description ?? "Servicio para niños/as de 3 a 7 años con control de esfínter. Menores de 3 años deben estar siempre con un adulto.\nEl ingreso y retiro siempre debe ser con un adulto responsable. Se debe firmar ingreso y entregar información de salud y alergias."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-4 mt-6">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 rounded-full border-2 border-[#1B4332] text-[#1B4332] font-semibold text-[14px] flex items-center justify-center gap-2 active:bg-[#1B4332] active:text-white transition-colors"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver a Familia y Niños
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
