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
  "Otras Actividades",
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
          <div className="flex gap-2 px-4 pt-8 pb-3 bg-[#F5F0E8]">
            {(["verano", "invierno"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setSeason(s); setSelectedCat(null); }}
                className={`flex-1 py-2 rounded-full transition-all border font-playfair font-bold text-center ${
                  season === s ? "bg-[#1B4332] text-white border-[#1B4332]" : "text-[#1B4332] border-[#1B4332]/40 bg-transparent"
                }`}
                style={{ fontSize: 24, lineHeight: 1 }}
              >
                {s === "verano" ? "Verano" : "Invierno"}
              </button>
            ))}
          </div>
          <div className="px-5 py-6 md:max-w-3xl md:mx-auto">
            <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
              Experiencias y Actividades
            </h1>
            {allCategories.length === 0 && activities.length === 0 && (
              <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando actividades…</p>
            )}
            {allCategories.length > 0 && (
              <div className="flex flex-col items-center gap-[46px] pb-6">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className="relative rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter"
                    style={{ width: 382, height: 114 }}
                  >
                    <img src={getCatImg(cat)} alt={cat} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-playfair font-bold text-center" style={{ fontSize: 24, lineHeight: 1, color: 'white' }}>{cat}</span>
                    </div>
                  </button>
                ))}
                <button onClick={() => window.history.back()} className="bg-[#1B4332] text-white px-6 py-2 rounded-full text-[14px] font-semibold active:opacity-80 mb-20">Volver</button>
              </div>
            )}
          </div>
          </div>
        ) : (
          /* ── Category detail ── */
          <div className="pb-24 md:pb-12 md:max-w-4xl md:mx-auto">
            {/* Hero */}
            <div className="relative overflow-hidden" style={{ width: '100%', height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
              <img
                src={getCatImg(selectedCat)}
                alt={selectedCat}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              {/* Category title centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="font-playfair font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1, color: 'white' }}>
                  {selectedCat}
                </h2>
              </div>
              {/* Volver button bottom center */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button onClick={() => setSelectedCat(null)} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80">Volver</button>
              </div>
            </div>

            <div className="pt-2">
              {selectedCat === "Caminatas y Trekkings" && (
                <div className="px-5 pt-4 pb-2 text-center">
                  <p className="text-[#3D2B1F] text-[14px] leading-relaxed">Exploración del entorno natural. Snacks incluidos y cocktail en salidas de puesta de sol.</p>
                  <p className="text-[#9B9280] text-[13px] mt-2">Para más información, acércate al mesón de recepción</p>
                </div>
              )}
              {catActivities.length === 0 ? (
                <p className="text-[#9B9280] text-center py-10 text-[14px] px-4">Próximamente actividades disponibles</p>
              ) : isOtras ? (
                <>
                  {freeActs.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>Actividades Gratuitas</h3>
                      <ActivitySlider activities={freeActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                  {paidActs.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>Actividades con Costo Extra</h3>
                      <ActivitySlider activities={paidActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                </>
              ) : (
                <ActivitySlider activities={catActivities} catImage={getCatImg(selectedCat)} />
              )}
            </div>

            <div className="px-5 mt-6 mb-8 text-center">
              <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1, color: '#DB7C59', textAlign: 'center' }}>
                Las actividades full day son operadas por proveedor externo y tienen costo adicional.
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
