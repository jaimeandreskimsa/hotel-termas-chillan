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
  | { type: "info_detail"; section: string; label: string }
  | { type: "productos" };

const INFO_SECTIONS = [
  { key: "caja",      label: "Caja de Seguridad", emergency: false },
  { key: "protocolo", label: "Protocolos",         emergency: false },
  { key: "emergencia",label: "Emergencias",        emergency: true  },
];

const PRODUCT_CATS = ["Cuidado Personal e Higiene", "Bebés y Niños", "Electrónica y Accesorios", "Vestuario y Accesorios", "Piscina y Deporte"];

function SubHero({ title, imageSrc, accentColor, onBack }: { title: string; imageSrc?: string; accentColor?: string; onBack: () => void; }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-b-3xl ${!imageSrc ? (accentColor ?? "bg-gradient-to-br from-[#1B4332] to-[#2D6A4F]") : ""}`} style={{ height: 378 }}>
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-6">
        <h1 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1, textAlign: "center" }} className="text-white drop-shadow-lg px-6">{title}</h1>
        <button onClick={onBack} className="bg-[#1B4332] text-white px-5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1 shadow-sm">
          <ChevronLeft size={14} /> Volver
        </button>
      </div>
    </div>
  );
}

export default function HabitacionPage() {
  const [view, setView] = useState<View>({ type: "home" });
  const [products, setProducts] = useState<Product[]>([]);
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [heroImg, setHeroImg] = useState("/images/habitacion.jpg");
  const [navImgs, setNavImgs] = useState({ img_housekeeping: "/images/habitacion.jpg", img_informacion: "/images/login-bg.jpg", img_productos: "/images/spa.jpg" });
  const [infoImgs, setInfoImgs] = useState({ img_caja: "/images/login-bg.jpg", img_protocolo: "/images/login-bg.jpg", img_emergencia: "/images/login-bg.jpg" });
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
      const ic = items.find(i => i.section === "img_caja");
      const ip = items.find(i => i.section === "img_protocolo");
      const ie = items.find(i => i.section === "img_emergencia");
      setInfoImgs({
        img_caja:       ic?.content ?? "/images/login-bg.jpg",
        img_protocolo:  ip?.content ?? "/images/login-bg.jpg",
        img_emergencia: ie?.content ?? "/images/login-bg.jpg",
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
        <div className="pt-14 px-4 pb-28 md:pb-12 md:max-w-3xl md:mx-auto">
          <h1 className="text-[#3D2B1F] text-center mt-12 mb-6" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1 }}>Mi Habitación</h1>
          <div className="flex flex-col items-center" style={{ gap: 46 }}>
            {NAV_CARDS.map(card => (
              <button key={card.key} onClick={() => setView({ type: card.key })} className="relative rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform" style={{ width: 382, height: 114 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <span className="text-white drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 24, lineHeight: 1, textAlign: "center" }}>{card.label}</span>
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
          <div className="px-4 py-5 md:max-w-3xl md:mx-auto">
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
                <h2 className="text-[#1B4332] text-center mb-3" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1 }}>Lavandería</h2>
                {lavanderiaItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-[#EDE6D8] shadow-sm px-4 py-4 mb-3">
                    <h3 className="font-semibold text-[#1B4332] text-[14px] mb-1.5">{item.title}</h3>
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
        <div className="pt-14 pb-28">
          <SubHero title="Información" imageSrc={navImgs.img_informacion} onBack={goBack} />
          <div className="px-4 py-5 flex flex-col gap-3 md:max-w-3xl md:mx-auto">
            {INFO_SECTIONS.map(sec => (
              <button key={sec.key} onClick={() => setView({ type: "info_detail", section: sec.key, label: sec.label })} className={`flex justify-between items-center px-4 py-4 rounded-xl text-left shadow-sm ${sec.emergency ? "bg-[#D4722A]" : "bg-white border border-[#EDE6D8]"}`}>
                <span className={`text-[15px] font-medium ${sec.emergency ? "text-white" : "text-[#3D2B1F]"}`}>{sec.label}</span>
                <ChevronRight size={18} className={sec.emergency ? "text-white" : "text-[#9B9280]"} />
              </button>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── INFO DETAIL ───────────────────────────────────────────────────────
  if (view.type === "info_detail") {
    const { section, label } = view;
    const isEmergencia = section === "emergencia";
    const sectionItems = info.filter(i => i.section === section);
    const sectionImgKey = section === "caja" ? "img_caja" : section === "protocolo" ? "img_protocolo" : "img_emergencia";
    const sectionHeroImg = infoImgs[sectionImgKey as keyof typeof infoImgs];
    return (
      <div className="min-h-svh bg-[#F5F0E8]">
        <Header />
        <div className="pt-14 pb-28">
          {isEmergencia ? (
            <div className="relative w-full flex flex-col items-center justify-center rounded-b-3xl" style={{ height: 378, background: "linear-gradient(180deg, #C0553A 0%, #D4722A 100%)" }}>
              <h1 className="text-white drop-shadow-lg mb-6" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1, textAlign: "center" }}>{label}</h1>
              <button onClick={goBack} className="bg-white/90 text-[#B85C45] px-5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1 shadow-sm">
                <ChevronLeft size={14} /> Volver
              </button>
            </div>
          ) : (
            <SubHero title={label} imageSrc={sectionHeroImg} onBack={goBack} />
          )}
          <div className="px-4 py-5 md:max-w-3xl md:mx-auto">
            {isEmergencia ? (
              sectionItems.length > 0 ? (
                <div className="flex flex-col items-center gap-5 text-center">
                  {sectionItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center gap-3">
                      <p className="text-[#4A4A4A] text-[14px] leading-relaxed">{item.title}</p>
                      <a href={`tel:${item.content.replace(/\s/g, "")}`} className="inline-block bg-[#B85C45] text-white font-semibold text-[16px] px-8 py-3 rounded-full active:opacity-80">{item.content}</a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 text-center">
                  <p className="text-[#4A4A4A] text-[14px] leading-relaxed">Si necesitas atención médica inmediata,<br />comúnicatе con la recepción llamando al:</p>
                  <a href="tel:3500" className="inline-block bg-[#B85C45] text-white font-semibold text-[16px] px-10 py-3 rounded-full active:opacity-80">3500</a>
                  <p className="text-[#4A4A4A] text-[14px] leading-relaxed">Si te encuentras fuera del Hotel, llama al:</p>
                  <a href="tel:+56223223500" className="inline-block bg-[#B85C45] text-white font-semibold text-[16px] px-8 py-3 rounded-full active:opacity-80">+562 2322 3500</a>
                </div>
              )
            ) : (
              sectionItems.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {sectionItems.map(item => (
                    <div key={item.id}>
                      <h3 className="font-semibold text-[#1B4332] text-[15px] mb-1">{item.title}</h3>
                      <p className="text-[#6B6B6B] text-[13px] leading-relaxed whitespace-pre-line">{item.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#9B9280] text-center py-10 text-[14px]">Sin información disponible aún.</p>
              )
            )}
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
        <div className="px-4 py-5 md:max-w-3xl md:mx-auto">
          {/* ── Lavandería ── */}
          {allProductCats.length > 0 && (
            <>
              <p className="text-[#6B6B6B] text-[14px] leading-relaxed text-center mb-5">Para su comodidad y ante cualquier olvido, el hotel dispone de una selección de artículos esenciales que puede adquirir directamente en el hotel.</p>
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
