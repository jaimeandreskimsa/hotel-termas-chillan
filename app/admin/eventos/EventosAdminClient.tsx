"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Trash2, CalendarDays, ToggleLeft, ToggleRight, Pencil, X, Check } from "lucide-react";

interface Event {
  id: number;
  day: string;
  month: string;
  time: string;
  title: string;
  description: string | null;
  location: string | null;
  active: boolean;
  order: number;
}

const emptyForm = { day: "", month: "", time: "", title: "", description: "", location: "", order: 0 };

export default function EventosAdminClient() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/admin/eventos").then(r => r.json()).then(d => setEventList(d.events ?? []));
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.day || !form.month || !form.time) return;
    setLoading(true);
    const res = await fetch("/api/admin/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const { event } = await res.json();
    setEventList(prev => [...prev, event]);
    setForm(emptyForm);
    setLoading(false);
  };

  const toggleActive = async (ev: Event) => {
    const res = await fetch("/api/admin/eventos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ev, active: !ev.active }),
    });
    const { event } = await res.json();
    setEventList(prev => prev.map(x => x.id === event.id ? event : x));
  };

  const startEdit = (ev: Event) => {
    setEditingId(ev.id);
    setEditForm({ day: ev.day, month: ev.month, time: ev.time, title: ev.title, description: ev.description ?? "", location: ev.location ?? "", order: ev.order });
  };

  const saveEdit = async (ev: Event) => {
    const res = await fetch("/api/admin/eventos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ev, ...editForm }),
    });
    const { event } = await res.json();
    setEventList(prev => prev.map(x => x.id === event.id ? event : x));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este evento?")) return;
    await fetch("/api/admin/eventos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEventList(prev => prev.filter(x => x.id !== id));
  };

  return (
    <AdminShell>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays size={22} className="text-[#1B4332]" />
          <h1 className="text-[22px] font-bold text-gray-900">Próximos Eventos</h1>
        </div>

        {/* Create form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Nuevo Evento</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <input
              value={form.day}
              onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              placeholder="Día (ej: 29)"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
            <input
              value={form.month}
              onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
              placeholder="Mes (ej: Mar)"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
            <input
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              placeholder="Hora (ej: 20:00)"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
          </div>
          <div className="flex flex-col gap-3">
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título del evento"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción (opcional)"
              rows={2}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332] resize-none"
            />
            <input
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Lugar (ej: Salón Los Riscos)"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
            <input
              type="number"
              value={form.order}
              onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
              placeholder="Orden (0 = primero)"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]"
            />
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-2.5 font-semibold text-[14px] disabled:opacity-60"
            >
              <Plus size={16} /> Agregar evento
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {eventList.length === 0 && (
            <p className="text-gray-400 text-[14px] text-center py-8">No hay eventos configurados.</p>
          )}
          {eventList.map(ev => (
            <div
              key={ev.id}
              className={`bg-white rounded-2xl border shadow-sm ${ev.active ? "border-[#1B4332]/20" : "border-gray-100 opacity-60"}`}
            >
              {editingId === ev.id ? (
                <div className="p-4 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={editForm.day} onChange={e => setEditForm(f => ({ ...f, day: e.target.value }))} placeholder="Día" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332]" />
                    <input value={editForm.month} onChange={e => setEditForm(f => ({ ...f, month: e.target.value }))} placeholder="Mes" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332]" />
                    <input value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} placeholder="Hora" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332]" />
                  </div>
                  <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Título" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332]" />
                  <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción" rows={2} className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332] resize-none" />
                  <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} placeholder="Lugar" className="border border-gray-200 rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[#1B4332]" />
                  <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-[13px]"><X size={14} /> Cancelar</button>
                    <button onClick={() => saveEdit(ev)} className="flex items-center gap-1 bg-[#1B4332] text-white px-3 py-1.5 rounded-lg text-[13px]"><Check size={14} /> Guardar</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-start gap-3">
                  <div className="bg-[#1B4332] text-white rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[18px] font-bold leading-none">{ev.day}</span>
                    <span className="text-[10px] uppercase">{ev.month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-[14px] truncate">{ev.title}</p>
                    <p className="text-gray-400 text-[12px]">{ev.time}{ev.location ? ` · ${ev.location}` : ""}</p>
                    {ev.description && <p className="text-gray-500 text-[12px] mt-0.5 line-clamp-2">{ev.description}</p>}
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${ev.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ev.active ? "Visible" : "Oculto"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(ev)} className="p-1.5 text-gray-400 hover:text-[#1B4332]"><Pencil size={15} /></button>
                    <button onClick={() => toggleActive(ev)} className="p-1.5 text-gray-400 hover:text-[#1B4332]">
                      {ev.active ? <ToggleRight size={18} className="text-[#1B4332]" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
