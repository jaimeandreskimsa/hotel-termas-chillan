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

function shortDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.split("\n")[0];
}

function extractBullets(desc: string | null): string[] {
  if (!desc) return [];
  return desc.split("\n").map(l => l.trim()).filter(Boolean).slice(1, 7);
}

function ProgramCard({ program, fallbackImage }: { program: Program; fallbackImage: string }) {
  const bullets = extractBullets(program.description);
  const img = program.image ?? fallbackImage;
  return (
    <div className="shrink-0 w-[82vw] max-w-[340px] bg-[#F3EDE4] rounded-2xl overflow-hidden shadow-sm snap-center">
      <div className="relative h-[245px] w-full bg-gray-200">
        <img src={img} alt={program.name} className="absolute inset-0 w-full h-full object-cover" />
        {program.schedule && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-[12px] font-semibold text-[#1B4332]">
            {program.schedule}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1B4332] text-[16px] leading-snug mb-1.5">
          {program.name}
        </h3>
        <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-3">
          {shortDesc(program.description)}
        </p>
        {bullets.length > 0 && (
          <ul className="flex flex-col gap-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                  <i className={`${bulletIcon(b)} text-[#D4722A]`} style={{ fontSize: 11 }} />
                </span>
                <span className="text-[#3D3D3D] text-[13px] leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-center gap-2 text-[#9B9280] text-[11px]">
          <i className="fi-ts-info" style={{ fontSize: 12 }} />
          <span>Para más información, acércate al mesón de recepción</span>
        </div>
      </div>
    </div>
  );
}

function ProgramSlider({ programs, fallbackImage }: { programs: Program[]; fallbackImage: string }) {
  return (
    <div className="md:max-w-4xl md:mx-auto">
      <div
        className="flex overflow-x-auto no-scrollbar gap-4 px-[9%] py-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {programs.map((p) => <ProgramCard key={p.id} program={p} fallbackImage={fallbackImage} />)}
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
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      <div className={selected ? "" : "pt-14"}>
        {!selected ? (
          /* ── List view ── */
          <div className="px-4 pt-8 pb-24 md:pb-12 md:max-w-2xl md:mx-auto">
            <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
              Familia y Niños
            </h1>
            <div className="flex flex-col gap-[46px]">
              {CATEGORIES.map(cat => {
                const img = cat.key === "ninos" ? catNinosImg : catGuarderiaImg;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelected(cat.key)}
                    className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter"
                    style={{ height: 114, background: '#1B4332' }}
                  >
                    <img src={img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-playfair font-bold text-center drop-shadow-md" style={{ fontSize: 24, color: 'white' }}>
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
              <button onClick={() => window.history.back()} className="bg-[#1B4332] text-white px-6 py-2 rounded-full text-[14px] font-semibold active:opacity-80 mx-auto mb-20">Volver</button>
            </div>
          </div>

        ) : selected === "ninos" ? (
          /* ── Niños detail ── */
          <div className="pb-24 md:pb-12">
            {/* Hero — full width */}
            <div className="relative overflow-hidden w-full" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
              <img src={catNinosImg} alt="Niños" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Niños</h2>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button onClick={() => setSelected(null)} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
              </div>
            </div>

            <div className="pt-2 md:max-w-4xl md:mx-auto">
              {/* Season toggle */}
              <div className="flex gap-2 px-5 pt-5 justify-center">
                {(["verano", "invierno"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`px-8 py-2 rounded-full font-playfair font-bold text-lg transition-all border ${season === s ? "bg-[#1B4332] text-white border-[#1B4332]" : "text-[#1B4332] border-[#1B4332]/40 bg-transparent"}`}
                  >
                    {s === "verano" ? "Verano" : "Invierno"}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-7 pt-4">
                {seasonActividades.length > 0 && (
                  <div>
                    <h3 className="font-playfair font-bold text-center px-4 mt-2 mb-1" style={{ fontSize: 32, lineHeight: 1, color: '#54432B' }}>
                      Actividades de Temporada
                    </h3>
                    <ProgramSlider programs={seasonActividades} fallbackImage={catNinosImg} />
                  </div>
                )}

                {clubs.length > 0 && (
                  <div>
                    <h3 className="font-playfair font-bold text-center px-4 mt-2 mb-1" style={{ fontSize: 32, lineHeight: 1, color: '#54432B' }}>
                      Actividades
                    </h3>
                    <ProgramSlider programs={clubs} fallbackImage={catNinosImg} />
                  </div>
                )}

                {seasonActividades.length === 0 && clubs.length === 0 && (
                  <p className="text-[#9B9280] text-center py-10 text-[14px] px-4">Próximamente actividades disponibles</p>
                )}
              </div>
            </div>
          </div>

        ) : (
          /* ── Guardería detail ── */
          <div className="pb-24 md:pb-12">
            {/* Hero */}
            <div className="relative overflow-hidden w-full" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
              <img src={catGuarderiaImg} alt="Guardería" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Guardería</h2>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button onClick={() => setSelected(null)} className="bg-[#1B4332] text-white text-[14px] font-semibold px-5 py-2 rounded-full active:opacity-80 flex items-center gap-1.5">
                  <i className="fi-ts-angle-left" style={{ fontSize: 12 }} /> Volver
                </button>
              </div>
            </div>

            <div className="px-5 pt-5 max-w-md mx-auto">
              {/* Horarios */}
              {guarderiaPrograms[0]?.schedule && (() => {
                const parts = guarderiaPrograms[0].schedule!.split('|').map(s => s.trim());
                return (
                  <div className="mb-4">
                    <p style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: "#54432B" }} className="mb-2">Horarios:</p>
                    {parts.map((p, i) => (
                      <p key={i} style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 14, color: "#3D2B1F", lineHeight: 1.6 }}>
                        <strong>{p.split(':')[0]}:</strong> {p.split(':').slice(1).join(':').trim()}
                      </p>
                    ))}
                  </div>
                );
              })()}

              {/* Info note */}
              <div className="flex items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid #E8DDD0" }}>
                <i className="fi-ts-info" style={{ fontSize: 13, color: "#D4722A" }} />
                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, color: "#9B9280" }}>
                  Para más información, acércate al mesón de recepción
                </span>
              </div>

              {/* Reglamento */}
              {guarderiaPrograms[0]?.description && (
                <div>
                  <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1, color: "#54432B", textAlign: "center" }} className="mb-4">
                    Reglamento
                  </h3>
                  <div style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 14, color: "#3D2B1F", lineHeight: 1.65 }}
                    className="whitespace-pre-line">
                    {guarderiaPrograms[0].description}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

