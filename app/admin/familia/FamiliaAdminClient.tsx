"use client";
import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, ImagePlus, Loader2, Search } from "lucide-react";
import Image from "next/image";

interface Program { id: number; type: string; name: string; description: string | null; schedule: string | null; season: string | null; active: boolean; image: string | null; }

const TYPE_LABELS: Record<string, string> = { club: "Kids Club", guarderia: "Guardería", actividad: "Actividad" };

async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json();
  return json.url ?? null;
}

async function saveCatImage(programs: Program[], setPrograms: React.Dispatch<React.SetStateAction<Program[]>>, type: string, label: string, url: string) {
  const existing = programs.find(p => p.type === type);
  if (existing) {
    const res = await fetch("/api/admin/familia", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, type, name: label, image: url }) });
    const json = await res.json();
    setPrograms(s => s.map(x => x.id === json.program.id ? json.program : x));
  } else {
    const res = await fetch("/api/admin/familia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, name: label, image: url, order: 99 }) });
    const json = await res.json();
    setPrograms(s => [...s, json.program]);
  }
}

function CatImageUpload({ label, type, programs, setPrograms, fallback }: { label: string; type: string; programs: Program[]; setPrograms: React.Dispatch<React.SetStateAction<Program[]>>; fallback: string }) {
  const record = programs.find(p => p.type === type);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      await saveCatImage(programs, setPrograms, type, label, url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setUploading(false);
  };

  const currentImg = record?.image ?? fallback;

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <Image src={currentImg} alt={label} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 text-[13px]">{label}</p>
        {saved && <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>}
        {!saved && <p className="text-gray-400 text-[11px] mt-0.5">Imagen de portada de la categoría</p>}
      </div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
      >
        {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
        {uploading ? "Subiendo..." : "Cambiar"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function FamiliaAdminClient({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [editing, setEditing] = useState<Partial<Program> | null>(null);
  const [query, setQuery] = useState("");

  // Reglamento state
  const reglamentoRecord = programs.find(p => p.type === "reglamento");
  const [reglamentoText, setReglamentoText] = useState(reglamentoRecord?.description ?? "");
  const [savingReglamento, setSavingReglamento] = useState(false);
  const [reglamentoSaved, setReglamentoSaved] = useState(false);

  const handleSaveReglamento = async () => {
    setSavingReglamento(true);
    if (reglamentoRecord) {
      const res = await fetch("/api/admin/familia", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: reglamentoRecord.id, type: "reglamento", name: "Reglamento Guardería", description: reglamentoText }) });
      const json = await res.json();
      setPrograms(s => s.map(x => x.id === json.program.id ? json.program : x));
    } else {
      const res = await fetch("/api/admin/familia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "reglamento", name: "Reglamento Guardería", description: reglamentoText, order: 99 }) });
      const json = await res.json();
      setPrograms(s => [...s, json.program]);
    }
    setSavingReglamento(false);
    setReglamentoSaved(true);
    setTimeout(() => setReglamentoSaved(false), 2500);
  };

  const byType = programs
    .filter(p => !['reglamento', 'cat_ninos', 'cat_guarderia'].includes(p.type))
    .reduce<Record<string, Program[]>>((acc, p) => {
      if (!acc[p.type]) acc[p.type] = [];
      acc[p.type].push(p);
      return acc;
    }, {});

  const handleSave = async (data: Partial<Program>) => {
    const isNew = !data.id;
    const res = await fetch("/api/admin/familia", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json();
    if (isNew) setPrograms(s => [...s, json.program]);
    else setPrograms(s => s.map(x => x.id === json.program.id ? json.program : x));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar?")) return;
    await fetch("/api/admin/familia", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPrograms(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Familia y Niños</h1>

      {/* ── Imágenes de categorías ── */}
      <div className="mb-7">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imágenes de Categorías</h2>
        <div className="flex flex-col gap-2">
          <CatImageUpload label="Niños" type="cat_ninos" programs={programs} setPrograms={setPrograms} fallback="/images/ninos.jpg" />
          <CatImageUpload label="Guardería" type="cat_guarderia" programs={programs} setPrograms={setPrograms} fallback="/images/guarderia.jpg" />
        </div>
      </div>

      <button onClick={() => setEditing({ type: "club", active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-5">
        <Plus size={15} /> Agregar programa
      </button>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar programa..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
      </div>
      {Object.entries(byType).map(([type, items]) => {
        const visible = query ? items.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) : items;
        if (visible.length === 0) return null;
        return (
        <div key={type} className="mb-6">
          <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-2">{TYPE_LABELS[type] ?? type}</h2>
          <div className="flex flex-col gap-2">
            {visible.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-start gap-3">
                <div className="flex-1 flex items-start gap-3">
                  {p.image && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-[14px]">{p.name}</p>
                    {p.schedule && <p className="text-gray-400 text-[12px] mt-0.5">{p.schedule}</p>}
                    {p.description && <p className="text-gray-400 text-[12px] mt-0.5 line-clamp-2">{p.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(p)} className="p-1.5 text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}

      {editing && (
        <EditModal
          item={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          reglamentoText={reglamentoText}
          onReglamentoChange={setReglamentoText}
          onSaveReglamento={handleSaveReglamento}
          reglamentoSaving={savingReglamento}
          reglamentoSaved={reglamentoSaved}
        />
      )}
    </div>
  );
}

function EditModal({ item, onSave, onClose, reglamentoText, onReglamentoChange, onSaveReglamento, reglamentoSaving, reglamentoSaved }: {
  item: Partial<Program>;
  onSave: (d: Partial<Program>) => void;
  onClose: () => void;
  reglamentoText?: string;
  onReglamentoChange?: (v: string) => void;
  onSaveReglamento?: () => void;
  reglamentoSaving?: boolean;
  reglamentoSaved?: boolean;
}) {
  const [form, setForm] = useState({ ...item });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) setForm(f => ({ ...f, image: json.url }));
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-gray-900">{form.id ? "Editar" : "Nuevo programa"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Tipo</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]" value={form.type ?? "club"} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="club">Kids Club</option>
              <option value="guarderia">Guardería</option>
              <option value="actividad">Actividad</option>
            </select>
          </div>
          {[{ key: "name", label: "Nombre" }, { key: "schedule", label: "Horario" }, { key: "description", label: "Descripción" }].map(f => (
            <div key={f.key}>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{f.label}</label>
              {f.key === "description" ? (
                <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px] resize-none" value={(form as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              ) : (
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]" value={(form as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}
          {/* Image upload */}
          <div>
            <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Imagen</label>
            {form.image ? (
              <div className="relative rounded-xl overflow-hidden h-36 bg-gray-100">
                <Image src={form.image} alt="Preview" fill className="object-cover" />
                <button onClick={() => setForm(f => ({ ...f, image: null }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#1B4332] hover:text-[#1B4332] transition-colors">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                <span className="text-[12px]">{uploading ? "Subiendo..." : "Subir imagen"}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Reglamento — only for guarderia */}
          {(form.type === "guarderia") && (
            <div>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Reglamento Guardería</label>
              <textarea
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px] resize-none"
                placeholder="Escribe el reglamento aquí..."
                value={reglamentoText ?? ""}
                onChange={e => onReglamentoChange?.(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] text-gray-600">Cancelar</button>
          <button
            onClick={() => { onSave(form); if (form.type === "guarderia") onSaveReglamento?.(); }}
            className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2"
          >
            {reglamentoSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {reglamentoSaved ? "✓ Guardado" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
