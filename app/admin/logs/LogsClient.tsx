"use client";
import { useState, useEffect, useCallback } from "react";
import { Activity, User, Shield, Filter, RefreshCw, Download, Search } from "lucide-react";

interface LogEntry {
  id: number;
  type: "guest" | "admin";
  action: string;
  module: string | null;
  actorName: string | null;
  actorEmail: string | null;
  details: string | null;
  createdAt: string;
}

const MODULE_LABELS: Record<string, string> = {
  spa: "Spa & Gym",
  restaurantes: "Restaurantes",
  actividades: "Actividades",
  familia: "Familia",
  habitacion: "Habitación",
  alertas: "Alertas",
  usuarios: "Usuarios",
};

const ACTION_LABELS: Record<string, string> = {
  login: "Inicio de sesión",
  view_home: "Visitó Home",
  view_spa: "Visitó Spa",
  view_gimnasio: "Visitó Gimnasio",
  view_wellness: "Visitó Wellness",
  view_restaurantes: "Visitó Restaurantes",
  view_actividades: "Visitó Actividades",
  view_familia: "Visitó Familia",
  view_habitacion: "Visitó Habitación",
  create_service: "Creó servicio",
  update_service: "Actualizó servicio",
  delete_service: "Eliminó servicio",
  create_item: "Creó ítem",
  update_item: "Actualizó ítem",
  delete_item: "Eliminó ítem",
  create_activity: "Creó actividad",
  update_activity: "Actualizó actividad",
  delete_activity: "Eliminó actividad",
  create_program: "Creó programa",
  update_program: "Actualizó programa",
  delete_program: "Eliminó programa",
  create_alert: "Creó alerta",
  update_alert: "Actualizó alerta",
  delete_alert: "Eliminó alerta",
  update_schedule: "Actualizó horario",
  create_user: "Creó usuario",
  update_user: "Actualizó usuario",
  delete_user: "Eliminó usuario",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function LogsClient({
  initialLogs,
  summary,
}: {
  initialLogs: LogEntry[];
  summary: { guests: number; admins: number };
}) {
  const [logs, setLogs] = useState(initialLogs);
  const [filtered, setFiltered] = useState(initialLogs);
  const [typeFilter, setTypeFilter] = useState<"all" | "guest" | "admin">("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const applyFilters = useCallback(
    (data: LogEntry[], t: string, m: string, s: string) => {
      let out = data;
      if (t !== "all") out = out.filter((l) => l.type === t);
      if (m !== "all") out = out.filter((l) => l.module === m);
      if (s.trim()) {
        const q = s.toLowerCase();
        out = out.filter(
          (l) =>
            l.actorName?.toLowerCase().includes(q) ||
            l.actorEmail?.toLowerCase().includes(q) ||
            l.action?.toLowerCase().includes(q) ||
            l.details?.toLowerCase().includes(q)
        );
      }
      return out;
    },
    []
  );

  useEffect(() => {
    setFiltered(applyFilters(logs, typeFilter, moduleFilter, search));
  }, [logs, typeFilter, moduleFilter, search, applyFilters]);

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/logs?limit=200");
    const data = await res.json();
    setLogs(data.logs ?? []);
    setLoading(false);
  };

  const exportCSV = () => {
    const header = "ID,Tipo,Acción,Módulo,Actor,Email,Detalle,Fecha\n";
    const rows = filtered
      .map((l) =>
        [
          l.id,
          l.type,
          l.action,
          l.module ?? "",
          l.actorName ?? "",
          l.actorEmail ?? "",
          `"${(l.details ?? "").replace(/"/g, "'")}"`,
          formatDateTime(l.createdAt),
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean))) as string[];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-[#1B4332]" />
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">Registro de Actividad</h1>
            <p className="text-gray-500 text-[13px]">Historial completo de la plataforma</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#2d6a4f] transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total eventos", value: logs.length, icon: Activity, color: "#1B4332", bg: "#D8F3DC" },
          { label: "Actividad guests", value: summary.guests, icon: User, color: "#C8963E", bg: "#FEF9EE" },
          { label: "Acciones admin", value: summary.admins, icon: Shield, color: "#1B4332", bg: "#D8F3DC" },
          { label: "Filtrados", value: filtered.length, icon: Filter, color: "#6B7280", bg: "#F3F4F6" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: s.bg }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-[28px] font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-[12px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, acción..."
            className="text-[13px] outline-none flex-1 bg-transparent"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "guest", "admin"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                typeFilter === t
                  ? "bg-[#1B4332] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "all" ? "Todos" : t === "guest" ? "Guests" : "Admins"}
            </button>
          ))}
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-gray-700 outline-none"
        >
          <option value="all">Todos los módulos</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {MODULE_LABELS[m] ?? m}
            </option>
          ))}
        </select>
      </div>

      {/* Log feed */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-[14px]">No hay eventos con los filtros actuales</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                {/* Avatar/icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    log.type === "admin" ? "bg-[#D8F3DC]" : "bg-[#FEF9EE]"
                  }`}
                >
                  {log.type === "admin" ? (
                    <Shield size={14} className="text-[#1B4332]" />
                  ) : (
                    <User size={14} className="text-[#C8963E]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-[13px]">
                      {log.actorName ?? "Desconocido"}
                    </span>
                    {log.actorEmail && (
                      <span className="text-gray-400 text-[12px]">{log.actorEmail}</span>
                    )}
                    {log.module && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {MODULE_LABELS[log.module] ?? log.module}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-gray-700 mt-0.5">
                    {ACTION_LABELS[log.action] ?? log.action}
                  </p>
                  {log.details && (
                    <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-2">{log.details}</p>
                  )}
                </div>

                {/* Time */}
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-medium text-gray-500">{timeAgo(log.createdAt)}</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">{formatDateTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
