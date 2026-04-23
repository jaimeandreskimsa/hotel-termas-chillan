"use client";
import { useState } from "react";
import { Plus, Trash2, Users, X, Search } from "lucide-react";

interface Admin { id: number; email: string; name: string; role: string; module: string | null; createdAt: Date | null; }

const MODULES = ["spa", "restaurantes", "actividades", "familia", "habitacion"];

export default function UsuariosClient({ initialUsers }: { initialUsers: Admin[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin", module: "spa" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return setError("Completa todos los campos.");
    setLoading(true);
    const res = await fetch("/api/admin/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { setError("Error al crear usuario."); setLoading(false); return; }
    const { user } = await res.json();
    setUsers(u => [...u, user]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "admin", module: "spa" });
    setError("");
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await fetch("/api/admin/usuarios", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setUsers(u => u.filter(x => x.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-[#1B4332]" />
          <h1 className="text-[22px] font-bold text-gray-900">Usuarios Admin</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium">
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-gray-900">Nuevo usuario admin</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[{ key: "name", label: "Nombre completo", type: "text" }, { key: "email", label: "Correo electrónico", type: "email" }, { key: "password", label: "Contraseña temporal", type: "password" }].map(f => (
                <div key={f.key}>
                  <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{f.label}</label>
                  <input type={f.type} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-[#1B4332]" value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Rol</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[14px]" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  <option value="admin">Admin de módulo</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              {form.role === "admin" && (
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Módulo asignado</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[14px]" value={form.module} onChange={e => setForm(p => ({ ...p, module: e.target.value }))}>
                    {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] font-medium text-gray-600">Cancelar</button>
              <button onClick={handleCreate} disabled={loading} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-semibold disabled:opacity-60">
                {loading ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar usuario..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
      </div>
      <div className="flex flex-col gap-3">
        {users.filter(u => !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())).map(u => (
          <div key={u.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900 text-[14px]">{u.name}</p>
              <p className="text-gray-400 text-[12px]">{u.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${u.role === "superadmin" ? "bg-[#1B4332] text-white" : "bg-[#D8F3DC] text-[#1B4332]"}`}>
                  {u.role === "superadmin" ? "Super Admin" : "Admin"}
                </span>
                {u.module && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium">{u.module}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
