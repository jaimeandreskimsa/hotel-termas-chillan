"use client";
import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, ImagePlus, Loader2, Search } from "lucide-react";
import Image from "next/image";

interface Service { id: number; category: string; name: string; description: string | null; duration: string | null; price: string | null; active: boolean; }
interface Schedule { id: number; venue: string; hours: string; }
interface GymClass { id: number; name: string; description: string | null; price: string | null; schedule: string | null; active: boolean; }
interface HeroProgram { id: number; type: string; image: string | null; }

interface Props {
  initialServices: Service[];
  initialSchedules: Schedule[];
  initialClasses: GymClass[];
  initialPrograms?: HeroProgram[];
}

const CATEGORIES = ["Masajes y Terapias", "Rituales de Renovación", "Faciales y Jacuzzi", "Peluquería y Manicure", "Circuitos de Agua"];

function ServiceModal({ item, onSave, onClose }: { item: Partial<Service>; onSave: (data: Partial<Service>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...item });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{item.id ? "Editar servicio" : "Nuevo servicio"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Categoría</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={form.category ?? ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {[{ key: "name", label: "Nombre" }, { key: "description", label: "Descripción" }, { key: "duration", label: "Duración" }, { key: "price", label: "Precio" }].map(field => (
            <div key={field.key}>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{field.label}</label>
              {field.key === "description" ? (
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] resize-none" rows={3} value={(form as Record<string, string | null | undefined | boolean>)[field.key] as string ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
              ) : (
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={(form as Record<string, string | null | undefined | boolean>)[field.key] as string ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] font-medium text-gray-600">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2">
            <Save size={15} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function GymModal({ item, onSave, onClose }: { item: Partial<GymClass>; onSave: (data: Partial<GymClass>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...item });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{item.id ? "Editar clase" : "Nueva clase"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          {[{ key: "name", label: "Nombre" }, { key: "description", label: "Descripción" }, { key: "schedule", label: "Horario (ej: 8:30 - 9:30)" }, { key: "price", label: "Precio" }].map(field => (
            <div key={field.key}>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{field.label}</label>
              {field.key === "description" ? (
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] resize-none" rows={3} value={(form as Record<string, string | null | undefined | boolean>)[field.key] as string ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
              ) : (
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={(form as Record<string, string | null | undefined | boolean>)[field.key] as string ?? ""} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] font-medium text-gray-600">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2">
            <Save size={15} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SpaAdminClient({ initialServices, initialSchedules, initialClasses, initialPrograms = [] }: Props) {
  const [tab, setTab] = useState<"spa" | "gym">("spa");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [services, setServices] = useState(initialServices);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [classes, setClasses] = useState(initialClasses);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingClass, setEditingClass] = useState<Partial<GymClass> | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  // Hero images
  const spaHeroRecord = initialPrograms.find(p => p.type === "hero_spa");
  const gymHeroRecord = initialPrograms.find(p => p.type === "hero_gimnasio");
  const [spaHeroImg, setSpaHeroImg] = useState(spaHeroRecord?.image ?? "/images/spa.jpg");
  const [gymHeroImg, setGymHeroImg] = useState(gymHeroRecord?.image ?? "/images/gimnasio.jpg");
  const [uploadingSpa, setUploadingSpa] = useState(false);
  const [uploadingGym, setUploadingGym] = useState(false);
  const [spaSaved, setSpaSaved] = useState(false);
  const [gymSaved, setGymSaved] = useState(false);
  const spaFileRef = useRef<HTMLInputElement>(null);
  const gymFileRef = useRef<HTMLInputElement>(null);

  const handleHeroUpload = async (
    type: "hero_spa" | "hero_gimnasio",
    record: HeroProgram | undefined,
    file: File,
    setImg: (u: string) => void,
    setUploading: (v: boolean) => void,
    setSaved: (v: boolean) => void,
  ) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploading(false); return; }
    const url = upJson.url;
    if (record) {
      await fetch("/api/admin/spa/hero", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, image: url }) });
    } else {
      await fetch("/api/admin/spa/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, image: url }) });
    }
    setImg(url);
    setUploading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const filtered = services.filter(s => s.category === activeCategory);

  const handleSaveService = async (data: Partial<Service>) => {
    setSaving(true);
    const isNew = !data.id;
    const res = await fetch("/api/admin/spa/services", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (isNew) setServices(s => [...s, json.service]);
    else setServices(s => s.map(x => x.id === json.service.id ? json.service : x));
    setEditingService(null);
    setSaving(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    await fetch("/api/admin/spa/services", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setServices(s => s.filter(x => x.id !== id));
  };

  const handleScheduleSave = async (s: Schedule) => {
    await fetch("/api/admin/spa/schedules", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    setSchedules(prev => prev.map(x => x.id === s.id ? s : x));
  };

  const handleSaveClass = async (data: Partial<GymClass>) => {
    setSaving(true);
    const isNew = !data.id;
    const res = await fetch("/api/admin/gym/classes", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (isNew) setClasses(c => [...c, json.gymClass]);
    else setClasses(c => c.map(x => x.id === json.gymClass.id ? json.gymClass : x));
    setEditingClass(null);
    setSaving(false);
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm("¿Eliminar esta clase?")) return;
    await fetch("/api/admin/gym/classes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setClasses(c => c.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Spa & Gimnasio</h1>

      {/* Tab */}
      <div className="flex gap-2 mb-6">
        {[{ key: "spa", label: "Spa Alunco" }, { key: "gym", label: "Gimnasio" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${tab === t.key ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Spa tab */}
      {tab === "spa" ? (
        <>
          {/* Hero image spa */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imagen Hero</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={spaHeroImg} alt="Hero Spa" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800">Foto principal del Spa</p>
                {spaSaved
                  ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
                  : <p className="text-gray-400 text-[11px] mt-0.5">Se muestra como hero en la app del huésped</p>}
              </div>
              <button type="button" onClick={() => spaFileRef.current?.click()} disabled={uploadingSpa} className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0">
                {uploadingSpa ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                {uploadingSpa ? "Subiendo..." : "Cambiar"}
              </button>
              <input ref={spaFileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleHeroUpload("hero_spa", spaHeroRecord, f, setSpaHeroImg, setUploadingSpa, setSpaSaved); }} />
            </div>
          </div>

          {/* Schedules */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
            <h2 className="font-semibold text-gray-900 mb-3">Horarios de Atención</h2>
            <div className="flex flex-col gap-2">
              {schedules.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-gray-700 w-32">{s.venue}</span>
                  <input className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] flex-1" value={s.hours} onChange={e => setSchedules(prev => prev.map(x => x.id === s.id ? { ...x, hours: e.target.value } : x))} />
                  <button onClick={() => handleScheduleSave(s)} className="bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium">Guardar</button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${activeCategory === cat ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                {cat}
              </button>
            ))}
          </div>

          <button onClick={() => setEditingService({ category: activeCategory, name: "", active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-4">
            <Plus size={15} /> Agregar servicio
          </button>
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar servicio..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
          </div>

          <div className="flex flex-col gap-3">
            {filtered.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase())).map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-[14px]">{s.name}</p>
                  {s.description && <p className="text-gray-500 text-[12px] mt-0.5 line-clamp-2">{s.description}</p>}
                  <div className="flex gap-3 mt-1">
                    {s.duration && <span className="text-[11px] text-gray-400">{s.duration}</span>}
                    {s.price && <span className="text-[11px] font-semibold text-[#1B4332]">{s.price}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditingService(s)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDeleteService(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Hero image gym */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imagen Hero</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={gymHeroImg} alt="Hero Gimnasio" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800">Foto principal del Gimnasio</p>
                {gymSaved
                  ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
                  : <p className="text-gray-400 text-[11px] mt-0.5">Se muestra como hero en la app del huésped</p>}
              </div>
              <button type="button" onClick={() => gymFileRef.current?.click()} disabled={uploadingGym} className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0">
                {uploadingGym ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                {uploadingGym ? "Subiendo..." : "Cambiar"}
              </button>
              <input ref={gymFileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleHeroUpload("hero_gimnasio", gymHeroRecord, f, setGymHeroImg, setUploadingGym, setGymSaved); }} />
            </div>
          </div>

          <button onClick={() => setEditingClass({ name: "", active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-5">
            <Plus size={15} /> Agregar clase
          </button>
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar clase..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
          </div>
          <div className="flex flex-col gap-3">
            {classes.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase())).map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-[14px]">{c.name}</p>
                  {c.description && <p className="text-gray-500 text-[12px] mt-0.5 line-clamp-2">{c.description}</p>}
                  <div className="flex gap-3 mt-1">
                    {c.schedule && <span className="text-[11px] text-gray-400">{c.schedule}</span>}
                    {c.price && <span className="text-[11px] font-semibold text-[#1B4332]">{c.price}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditingClass(c)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDeleteClass(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editingService && !saving && <ServiceModal item={editingService} onSave={handleSaveService} onClose={() => setEditingService(null)} />}
      {editingClass && !saving && <GymModal item={editingClass} onSave={handleSaveClass} onClose={() => setEditingClass(null)} />}
    </div>
  );
}
