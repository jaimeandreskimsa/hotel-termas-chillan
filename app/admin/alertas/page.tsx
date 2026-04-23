"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Trash2, Bell, ToggleLeft, ToggleRight, Search } from "lucide-react";

interface Alert { id: number; title: string; message: string; type: string; active: boolean; }

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [form, setForm] = useState({ title: "", message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/alerts").then(r => r.json()).then(d => setAlerts(d.alerts ?? []));
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.message) return;
    setLoading(true);
    const res = await fetch("/api/admin/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const { alert } = await res.json();
    setAlerts(a => [alert, ...a]);
    setForm({ title: "", message: "", type: "info" });
    setLoading(false);
  };

  const toggleActive = async (alert: Alert) => {
    const res = await fetch("/api/admin/alerts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...alert, active: !alert.active }) });
    const { alert: updated } = await res.json();
    setAlerts(a => a.map(x => x.id === updated.id ? updated : x));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta alerta?")) return;
    await fetch("/api/admin/alerts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAlerts(a => a.filter(x => x.id !== id));
  };

  return (
    <AdminShell>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={22} className="text-[#1B4332]" />
          <h1 className="text-[22px] font-bold text-gray-900">Alertas Activas</h1>
        </div>

        {/* Create form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Nueva Alerta</h2>
          <div className="flex flex-col gap-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título de la alerta" className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]" />
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Mensaje de la alerta" rows={3} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332] resize-none" />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[14px]">
              <option value="info">Información</option>
              <option value="warning">Advertencia</option>
              <option value="closed">Cierre temporal</option>
            </select>
            <button onClick={handleCreate} disabled={loading} className="flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-2.5 font-semibold text-[14px] disabled:opacity-60">
              <Plus size={16} /> Publicar alerta
            </button>
          </div>
        </div>

        {/* List */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar alerta..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
        </div>
        <div className="flex flex-col gap-3">
          {alerts.filter(a => !query || a.title.toLowerCase().includes(query.toLowerCase()) || a.message.toLowerCase().includes(query.toLowerCase())).map(alert => (
            <div key={alert.id} className={`bg-white rounded-2xl p-4 border shadow-sm ${alert.active ? "border-[#D4722A]/30" : "border-gray-100 opacity-60"}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-[14px]">{alert.title}</p>
                  <p className="text-gray-500 text-[12px] mt-0.5">{alert.message}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${alert.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {alert.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="flex gap-2 items-center ml-3">
                  <button onClick={() => toggleActive(alert)} className="text-gray-400 hover:text-[#1B4332] transition-colors">
                    {alert.active ? <ToggleRight size={22} className="text-[#1B4332]" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(alert.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-gray-400 text-center py-8">No hay alertas registradas.</p>}
        </div>
      </div>
    </AdminShell>
  );
}
