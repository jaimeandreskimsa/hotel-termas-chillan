"use client";
import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, ImagePlus, Loader2, Search } from "lucide-react";
import Image from "next/image";

interface Item { id: number; restaurant: string; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; active: boolean; }
interface HeroProgram { id: number; type: string; image: string | null; }

const RESTAURANTS = ["arboleda", "lagrieta", "muffin"];
const RESTAURANT_LABELS: Record<string, string> = { arboleda: "Arboleda", lagrieta: "La Grieta", muffin: "Muffin Café" };
const REST_DEFAULTS: Record<string, string> = { arboleda: "/images/arboleda.jpg", lagrieta: "/images/lagrieta.jpg", muffin: "/images/muffin.jpg" };

function EditModal({ item, onSave, onClose }: { item: Partial<Item>; onSave: (d: Partial<Item>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...item });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{item.id ? "Editar ítem" : "Nuevo ítem"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          {[{ key: "category", label: "Categoría" }, { key: "subcategory", label: "Subcategoría (opcional)" }, { key: "name", label: "Nombre" }, { key: "description", label: "Descripción" }, { key: "price", label: "Precio" }].map(f => (
            <div key={f.key}>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{f.label}</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={(form as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] font-medium text-gray-600">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2"><Save size={15} /> Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantesAdminClient({ initialItems, initialPrograms = [] }: { initialItems: Item[]; initialPrograms?: HeroProgram[] }) {
  const [activeRest, setActiveRest] = useState(RESTAURANTS[0]);
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [query, setQuery] = useState("");

  // Hero images per restaurant
  const [heroImgs, setHeroImgs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    RESTAURANTS.forEach(r => {
      const rec = initialPrograms.find(p => p.type === `hero_rest_${r}`);
      map[r] = rec?.image ?? REST_DEFAULTS[r];
    });
    return map;
  });
  const [heroRecords, setHeroRecords] = useState<Record<string, HeroProgram | undefined>>(() => {
    const map: Record<string, HeroProgram | undefined> = {};
    RESTAURANTS.forEach(r => { map[r] = initialPrograms.find(p => p.type === `hero_rest_${r}`); });
    return map;
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const rest = uploadTarget;
    if (!file || !rest) return;
    setUploading(rest);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploading(null); return; }
    const url = upJson.url;
    const existing = heroRecords[rest];
    if (existing) {
      await fetch("/api/admin/restaurantes/hero", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, image: url }) });
      setHeroRecords(s => ({ ...s, [rest]: { ...existing, image: url } }));
    } else {
      const res = await fetch("/api/admin/restaurantes/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: `hero_rest_${rest}`, image: url }) });
      const json = await res.json();
      setHeroRecords(s => ({ ...s, [rest]: json.program }));
    }
    setHeroImgs(s => ({ ...s, [rest]: url }));
    setUploading(null);
    setSaved(rest);
    setTimeout(() => setSaved(null), 2500);
    e.target.value = "";
  };

  const filtered = items.filter(i => i.restaurant === activeRest);

  const byCategory = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSave = async (data: Partial<Item>) => {
    const isNew = !data.id;
    const res = await fetch("/api/admin/restaurantes", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, restaurant: activeRest }) });
    const json = await res.json();
    if (isNew) setItems(s => [...s, json.item]);
    else setItems(s => s.map(x => x.id === json.item.id ? json.item : x));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este ítem?")) return;
    await fetch("/api/admin/restaurantes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Restaurantes</h1>
      <div className="flex gap-2 mb-6">
        {RESTAURANTS.map(r => (
          <button key={r} onClick={() => setActiveRest(r)} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${activeRest === r ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {RESTAURANT_LABELS[r]}
          </button>
        ))}
      </div>

      {/* Hero image */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imagen del Restaurante</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <Image src={heroImgs[activeRest]} alt={RESTAURANT_LABELS[activeRest]} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-gray-800">{RESTAURANT_LABELS[activeRest]}</p>
            {saved === activeRest
              ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
              : <p className="text-gray-400 text-[11px] mt-0.5">Foto de portada en la app del huésped</p>}
          </div>
          <button
            type="button"
            onClick={() => { setUploadTarget(activeRest); setTimeout(() => fileRef.current?.click(), 0); }}
            disabled={uploading === activeRest}
            className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
          >
            {uploading === activeRest ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
            {uploading === activeRest ? "Subiendo..." : "Cambiar"}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </div>

      <button onClick={() => setEditing({ restaurant: activeRest, active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-5">
        <Plus size={15} /> Agregar ítem
      </button>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar ítem..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
      </div>

      {Object.entries(byCategory).map(([cat, catItems]) => {
        const visible = query ? catItems.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase())) : catItems;
        if (visible.length === 0) return null;
        return (
        <div key={cat} className="mb-6">
          <h2 className="font-semibold text-gray-700 text-[14px] mb-2 uppercase tracking-wide">{cat}</h2>
          <div className="flex flex-col gap-2">
            {visible.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-[14px]">{item.name}</p>
                  {item.description && <p className="text-gray-400 text-[12px] mt-0.5 line-clamp-2">{item.description}</p>}
                  {item.price && <p className="text-[#1B4332] font-semibold text-[12px] mt-1">{item.price}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}

      {editing && <EditModal item={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
    </div>
  );
}
