"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface Product { id: number; category: string; name: string; price: string | null; }
interface InfoItem { id: number; section: string; title: string; content: string; }

type View =
  | { type: "home" }
  | { type: "housekeeping" }
  | { type: "info_menu" }
  | { type: "info_detail"; item: InfoItem }
  | { type: "productos" };

const PRODUCT_CATS = ["Cuidado Personal e Higiene", "Bebés y Niños", "Electrónica y Accesorios", "Vestuario y Accesorios", "Piscina y Deporte"];

function SubHero({ title, imageSrc, accentColor, onBack }: { title: string; imageSrc?: string; accentColor?: string; onBack: () => void; }) {
  return (
    <div className={`relative w-full h-44 overflow-hidden rounded-b-3xl ${!imageSrc ? (accentColor ?? "bg-gradient-to-br from-[#1B4332] to-[#2D6A4F]") : ""}`}>
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 flex items-end p-5">
        <h1 className="font-playfair text-white text-[32px] font-bold drop-shadow-lg">{title}</h1>
      </div>
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1B4332] px-3 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1 shadow-sm">
        <ChevronLeft size={14} /> Volver
      </button>
    </div>
  );
}

export default function HabitacionPage() {
  const [view, setView] = useState<View>({ type: "home" });
  const [products, setProducts] = useState<Product[]>([]);
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [heroImg, setHeroImg] = useState("/images/habitacion.jpg");
  const [navImgs, setNavImgs] = useState({ img_housekeeping: "/images/habitacion.jpg", img_informacion: "/images/login-bg.jpg", img_productos: "/images/spa.jpg" });
  const [activeProductCat, setActiveProductCat] = useState(PRODUCT_CATS[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/habitacion/products").then(r => r.json()).then(d => setProducts(d.products ?? []));
    fetch("/api/habitacion/info").then(r => r.json()).then(d => {
      const items: InfoItem[] = d.info ?? [];
      setInfo(items);
      const hero = items.find(i => i.section === "hero_image");
      if (hero?.content) setHeroImg(hero.content);
      const hs = items.find(i => i.section === "img_housekeeping");
      const inf = items.find(i => i.section === "img_informacion");
      const prod = items.find(i => i.section === "img_productos");
      setNavImgs({
        img_housekeeping: hs?.content ?? "/images/habitacion.jpg",
        img_informacion:  inf?.content ?? "/images/login-bg.jpg",
        img_productos:    prod?.content ?? "/images/spa.jpg",
      });
    });
  }, []);

  const goBack = () => {
    if (view.type === "info_detail") setView({ type: "info_menu" });
    else setView({ type: "home" });
  };

  const SYSTEM_SECTIONS = new Set(["hero_image", "housekeeping", "lavanderia", "img_housekeeping", "img_informacion", "img_productos"]);
  const housekeepingItems = info.filter(i => i.section === "housekeeping");
  const lavanderiaItems = info.filter(i => i.section === "lavanderia");
  const infoMenuItems = info.filter(i => !SYSTEM_SECTIONS.has(i.section));
  const allProductCats = [...new Set(products.map(p => p.category))];
  const productsByCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});
  const filteredProducts = products.filter(p => p.category === activeProductCat);

  // ── HOME ──────────────────────────────────────────────────────────────
  if (view.type === "home") {
    const NAV_CARDS = [
      { key: "housekeeping" as const, label: "Housekeeping", img: navImgs.img_housekeeping },
      { key: "info_menu"    as const, label: "Información",  img: navImgs.img_informacion },
      { key: "productos"    as const, label: "Productos",    img: navImgs.img_productos },
    ];
    return (
      <div className="min-h-svh bg-[#F5F0E8]">
        <Header />
        <div className="pt-14 px-4 pb-28">
          <h1 className="font-playfair text-[#3D2B1F] text-[32px] font-bold text-center mt-6 mb-6">Mi Habitación</h1>
          <div className="flex flex-col gap-4">
            {NAV_CARDS.map(card => (
              <button key={card.key} onClick={() => setView({ type: card.key })} className="relative h-[110px] rounded-2xl overflow-hidden w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <span className="font-playfair text-white text-[24px] font-bold drop-shadow-lg">{card.label}</span>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 bg-[#1B4332] text-white px-5 py-2 rounded-full text-[13px] font-medium mx-auto mt-7">
            <ChevronLeft size={15} /> Volver
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── HOUSEKEEPING ──────────────────────────────────────────────────────
  if (view.type === "housekeeping") {
    return (
      <div className="min-h-svh bg-[#F5F0E8]">
        <Header />
        <div className="pt-14 pb-28">
          <SubHero title="Housekeeping" imageSrc={heroImg} onBack={goBack} />
          <div className="px-4 py-5">
            {housekeepingItems.length > 0 ? (
              housekeepingItems.map(item => (
                <div key={item.id} className="mb-5">
                  <h2 className="font-semibold text-[#3D2B1F] text-[15px] mb-1">{item.title}</h2>
                  <p className="text-[#6B6B6B] text-[13px] leading-relaxed whitespace-pre-line">{item.content}</p>
                </div>
              ))
            ) : (
              <div className="mb-5">
                <p className="font-semibold text-[#3D2B1F] text-[14px] mb-2">Horarios de Atención:</p>
                <p className="text-[#6B6B6B] text-[13px]"><span className="font-semibold text-[#1B4332]">Housekeeping:</span> 08:30 a 23:00</p>
                <p className="text-[#6B6B6B] text-[13px]"><span className="font-semibold text-[#1B4332]">Almuerzo:</span> 08:30 a 16:00</p>
              </div>
            )}
            {lavanderiaItems.length > 0 && (
              <>
                <hr className="border-[#E0D8CC] my-4" />
                <h2 className="font-playfair text-[#1B4332] text-[20px] font-bold mb-3">Lavandería</h2>
                {lavanderiaItems.map(item => (
                  <div key={item.id} className="mb-4">
                    <h3 className="font-semibold text-[#3D2B1F] text-[14px] mb-1">{item.title}</h3>
                    <p className="text-[#6B6B6B] text-[13px] leading-relaxed whitespace-pre-line">{item.content}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── INFORMACIÓN MENU ──────────────────────────────────────────────────
  if (view.type === "info_menu") {
    return (
      <div className="min-h-svh bg-[#F5F0E8]">
        <Header />
        <div className="pt-14 pb-28 px-4">
          <h1 className="font-playfair text-[#3D2B1F] text-[32px] font-bold mt-6 mb-6">Información</h1>
          <div className="flex flex-col gap-3">
            {infoMenuItems.map(item => {
              const isEmergencia = item.section === "emergencia";
              return (
                <button key={item.id} onClick={() => setView({ type: "info_detail", item })} className={`flex justify-between items-center px-4 py-4 rounded-xl text-left shadow-sm ${isEmergencia ? "bg-[#D4722A]" : "bg-white border border-[#EDE6D8]"}`}>
                  <span className={`text-[15px] font-medium ${isEmergencia ? "text-white" : "text-[#3D2B1F]"}`}>{item.title}</span>
                  <ChevronRight size={18} className={isEmergencia ? "text-white" : "text-[#9B9280]"} />
                </button>
              );
            })}
            {infoMenuItems.length === 0 && <p className="text-[#9B9280] text-center py-10 text-[14px]">Sin información disponible.</p>}
          </div>
          <button onClick={goBack} className="flex items-center gap-1.5 bg-[#1B4332] text-white px-5 py-2 rounded-full text-[13px] font-medium mx-auto mt-7">
            <ChevronLeft size={15} /> Volver
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── INFO DETAIL ───────────────────────────────────────────────────────
  if (view.type === "info_detail") {
    const item = view.item;
    const isEmergencia = item.section === "emergencia";
    return (
      <div className="min-h-svh bg-[#F5F0E8]">
        <Header />
        <div className="pt-14 pb-28">
          {isEmergencia ? (
            <div className="relative w-full h-44 rounded-b-3xl bg-[#D4722A] flex items-end p-5">
              <h1 className="font-playfair text-white text-[32px] font-bold drop-shadow-lg">{item.title}</h1>
              <button onClick={goBack} className="absolute top-4 left-4 bg-white/90 text-[#D4722A] px-3 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1 shadow-sm">
                <ChevronLeft size={14} /> Volver
              </button>
            </div>
          ) : (
            <SubHero title={item.title} imageSrc="/images/login-bg.jpg" onBack={goBack} />
          )}
          <div className="px-4 py-5">
            <p className="text-[#6B6B6B] text-[13px] leading-relaxed whitespace-pre-line">{item.content}</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── PRODUCTOS ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />
      <div className="pt-14 pb-28">
        <SubHero title="Productos" imageSrc={navImgs.img_productos} onBack={goBack} />
        <div className="px-4 py-5">
          {/* ── Lavandería ── */}
          {allProductCats.length > 0 && (
            <>
              <h2 className="font-playfair text-[#1B4332] text-[20px] font-bold mb-3">Lavandería</h2>
              <div className="flex flex-col gap-2 mb-6">
                {allProductCats.map(cat => (
                  <div key={cat} className="bg-white rounded-xl border border-[#EDE6D8] overflow-hidden shadow-sm">
                    <button onClick={() => setOpenAccordion(openAccordion === cat ? null : cat)} className="w-full flex justify-between items-center px-4 py-3.5">
                      <span className="text-[#3D2B1F] text-[14px] font-medium text-left">{cat}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#9B9280] text-[12px]">{productsByCategory[cat]?.length} artículos</span>
                        {openAccordion === cat ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                      </div>
                    </button>
                    {openAccordion === cat && (
                      <div className="border-t border-[#EDE6D8] px-4 py-3 flex flex-col gap-2.5">
                        {productsByCategory[cat].map(p => (
                          <div key={p.id} className="flex justify-between items-center">
                            <span className="text-[#6B6B6B] text-[13px]">{p.name}</span>
                            {p.price && <span className="text-[#1B4332] font-semibold text-[12px]">{p.price}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
