"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Activity {
  id: number;
  season: string;
  category: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
}

const CATEGORY_ORDER_VERANO = [
  "Caminatas y Trekkings",
  "Bicicleta",
  "Contemplación y Recreación",
  "Bienestar y Talleres",
  "Otras Actividades",
];

const CATEGORY_ORDER_INVIERNO = [
  "Centro de Ski",
  "Deportes de Nieve",
  "Exploración y Naturaleza",
  "Bienestar y Talleres Indoor",
];

const CAT_FALLBACKS: Record<string, string> = {
  "Caminatas y Trekkings":      "/images/actividades.jpg",
  "Bicicleta":                  "/images/actividades.jpg",
  "Contemplación y Recreación": "/images/login-bg.jpg",
  "Bienestar y Talleres":       "/images/spa.jpg",
  "Otras Actividades":          "/images/home-hero.jpg",
  "Centro de Ski":              "/images/actividades.jpg",
  "Deportes de Nieve":          "/images/actividades.jpg",
  "Exploración y Naturaleza":   "/images/login-bg.jpg",
  "Bienestar y Talleres Indoor":"/images/spa.jpg",
};

function catKey(cat: string) {
  return "act_cat_" + cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function shortDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.split("\n")[0];
}

function extractBullets(desc: string | null): string[] {
  if (!desc) return [];
  return desc
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(1, 7);
}

function bulletIcon(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("hora") || t.includes("minuto") || t.includes("duración")) return "fi-ts-clock";
  if (t.includes("altitud") || t.includes("msnm")) return "fi-ts-mountain";
  if (t.includes("dificultad")) return "fi-ts-bolt";
  if (t.includes("km") || t.includes("distancia")) return "fi-ts-route";
  if (t.includes("pasajero") || t.includes("persona") || t.includes("guía") || t.includes("grupo")) return "fi-ts-users";
  if (t.includes("costo") || t.includes("precio") || t.includes("adicional")) return "fi-ts-receipt";
  if (t.includes("reserva") || t.includes("recepción") || t.includes("anexo")) return "fi-ts-info";
  return "fi-ts-check";
}

function ActivityCard({ activity, catImage }: { activity: Activity; catImage: string }) {
  const bullets = extractBullets(activity.description);
  const imgSrc = activity.image ?? catImage;

  return (
    <div className="shrink-0 w-[82vw] max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-sm snap-center">
      <div className="relative h-[245px] w-full bg-gray-200">
        <img src={imgSrc} alt={activity.name} className="absolute inset-0 w-full h-full object-cover" />
        {activity.price && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-[12px] font-semibold text-[#1B4332]">
            {activity.price}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1B4332] text-[16px] leading-snug mb-1.5">
          {activity.name}
        </h3>
        <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-3">
          {shortDesc(activity.description)}
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

function ActivitySlider({ activities, catImage }: { activities: Activity[]; catImage: string }) {
  return (
    <div
      className="flex overflow-x-auto no-scrollbar gap-4 px-[9%] py-4"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {activities.map((a) => <ActivityCard key={a.id} activity={a} catImage={catImage} />)}
    </div>
  );
}

export default function ActividadesPage() {
  const [season, setSeason] = useState<"verano" | "invierno">("verano");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [catImgMap, setCatImgMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/actividades")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities ?? []));
    fetch("/api/habitacion/info")
      .then((r) => r.json())
      .then((d) => {
        const allCats = [...CATEGORY_ORDER_VERANO, ...CATEGORY_ORDER_INVIERNO];
        const map: Record<string, string> = {};
        for (const item of (d.info ?? [])) {
          if (item.section?.startsWith("act_cat_")) {
            const cat = allCats.find(c => catKey(c) === item.section);
            if (cat) map[cat] = item.content;
          }
        }
        setCatImgMap(map);
      });
  }, []);

  const getCatImg = (cat: string) => catImgMap[cat] ?? CAT_FALLBACKS[cat] ?? "/images/actividades.jpg";

  const CATEGORY_ORDER = season === "verano" ? CATEGORY_ORDER_VERANO : CATEGORY_ORDER_INVIERNO;

  const filtered = activities.filter((a) => a.season === season);
  const byCategory = filtered.reduce<Record<string, Activity[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  const allCategories = season === "invierno"
    ? CATEGORY_ORDER_INVIERNO
    : [
        ...CATEGORY_ORDER_VERANO,
        ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER_VERANO.includes(c)),
      ];

  const catActivities = selectedCat ? (byCategory[selectedCat] ?? []) : [];
  const freeActs = catActivities.filter((a) => !a.price);
  const paidActs = catActivities.filter((a) => a.price);
  const isOtras = selectedCat === "Otras Actividades";

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />

      <div className="pt-14">
        {!selectedCat ? (
          /* ── Category list ── */
          <div className="flex flex-col">
            {/* Season toggle */}
            <div className="flex bg-[#1B4332] gap-2 px-4 py-3">
              {(["verano", "invierno"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSeason(s); setSelectedCat(null); }}
                  className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    season === s ? "bg-white text-[#1B4332]" : "text-white border border-white/40"
                  }`}
                >
                  {s === "verano" ? "☀️ Verano" : "⛷️ Invierno"}
                </button>
              ))}
            </div>
          <div className="px-5 py-6">
            <h1 className="font-playfair text-[#1B4332] text-[32px] font-bold text-center mb-6">
              Experiencias y Actividades
            </h1>
            {allCategories.length === 0 && activities.length === 0 && (
              <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando actividades…</p>
            )}
            {allCategories.length > 0 && (
              <div className="flex flex-col gap-5 pb-28">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className="relative w-full rounded-2xl overflow-hidden shadow-card active:scale-[0.98] transition-transform"
                    style={{ height: 114 }}
                  >
                    <img src={getCatImg(cat)} alt={cat} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="font-playfair text-white text-2xl font-bold">{cat}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        ) : (
          /* ── Category detail ── */
          <div className="pb-24">
            {/* Hero */}
            <div className="relative h-[240px] w-full rounded-b-3xl overflow-hidden">
              <img
                src={getCatImg(selectedCat)}
                alt={selectedCat}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/70" />
              {/* Volver button */}
              <button
                onClick={() => setSelectedCat(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1B4332] text-white rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver
              </button>
              {/* Category title */}
              <div className="absolute bottom-5 left-0 right-0 px-6 text-center">
                <h2 className="font-playfair text-white text-[28px] font-bold leading-tight drop-shadow-lg">
                  {selectedCat}
                </h2>
              </div>
            </div>

            <div className="pt-2">
              {catActivities.length === 0 ? (
                <p className="text-[#9B9280] text-center py-10 text-[14px] px-4">Próximamente actividades disponibles</p>
              ) : isOtras ? (
                <>
                  {freeActs.length > 0 && (
                    <>
                      <h3 className="font-playfair text-[#1B4332] text-[17px] font-bold px-4 mt-4 mb-1">Actividades Gratuitas</h3>
                      <ActivitySlider activities={freeActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                  {paidActs.length > 0 && (
                    <>
                      <h3 className="font-playfair text-[#1B4332] text-[17px] font-bold px-4 mt-4 mb-1">Actividades con Costo Extra</h3>
                      <ActivitySlider activities={paidActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                </>
              ) : (
                <ActivitySlider activities={catActivities} catImage={getCatImg(selectedCat)} />
              )}
            </div>

            {/* Volver bottom */}
            <div className="px-4 mt-4">
              <button
                onClick={() => setSelectedCat(null)}
                className="w-full py-3 rounded-full border-2 border-[#1B4332] text-[#1B4332] font-semibold text-[14px] active:bg-[#1B4332] active:text-white transition-colors flex items-center justify-center gap-2"
              >
                <i className="fi-rs-angle-left" style={{ fontSize: 13 }} />
                Volver a Actividades
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
