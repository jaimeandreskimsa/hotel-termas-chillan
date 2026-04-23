import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { spaServices, restaurantItems, activities, alerts } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { LayoutDashboard, Sparkles, UtensilsCrossed, Mountain, Bell } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [spaCount] = await db.select({ value: count() }).from(spaServices);
  const [restCount] = await db.select({ value: count() }).from(restaurantItems);
  const [actCount] = await db.select({ value: count() }).from(activities);
  const [alertCount] = await db.select({ value: count() }).from(alerts).where(eq(alerts.active, true));

  const stats = [
    { label: "Servicios Spa", value: spaCount.value, icon: Sparkles, href: "/admin/spa", color: "bg-emerald-50 text-emerald-700" },
    { label: "Ítems Restaurantes", value: restCount.value, icon: UtensilsCrossed, href: "/admin/restaurantes", color: "bg-amber-50 text-amber-700" },
    { label: "Actividades", value: actCount.value, icon: Mountain, href: "/admin/actividades", color: "bg-blue-50 text-blue-700" },
    { label: "Alertas Activas", value: alertCount.value, icon: Bell, href: "/admin/alertas", color: "bg-red-50 text-red-700" },
  ];

  const role = (session.user as { role?: string })?.role;

  return (
    <AdminShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 bg-[#D8F3DC] rounded-xl flex items-center justify-center shrink-0">
            <LayoutDashboard size={20} className="text-[#1B4332]" />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-[12px] sm:text-[13px]">
              Bienvenido, {session.user?.name}
              {role === "superadmin" && <span className="ml-2 bg-[#1B4332] text-white text-[10px] px-2 py-0.5 rounded-full">Super Admin</span>}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map(s => (
            <a
              key={s.label}
              href={s.href}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <p className="text-[26px] sm:text-[30px] font-bold text-gray-900 leading-none">{s.value}</p>
              <p className="text-gray-500 text-[11px] sm:text-[13px] mt-1">{s.label}</p>
            </a>
          ))}
        </div>

        {/* Quick access */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 sm:mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-[14px]">Acceso rápido</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { href: "/admin/alertas", label: "Gestionar alertas", desc: "Crear y editar alertas para huéspedes", icon: Bell },
              { href: "/admin/spa", label: "Spa & Gimnasio", desc: "Servicios, precios y horarios", icon: Sparkles },
              { href: "/admin/restaurantes", label: "Restaurantes", desc: "Menús y carta de vinos", icon: UtensilsCrossed },
            ].map(item => (
              <a key={item.href} href={item.href} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-[#D8F3DC] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={15} className="text-[#1B4332]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-[13px]">{item.label}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-[#1B4332] rounded-2xl p-4 sm:p-5 text-white">
          <p className="font-semibold mb-1 text-[14px]">Hotel Termas de Chillán · Panel de Administración</p>
          <p className="text-white/70 text-[12px] sm:text-[13px]">
            Usa el menú lateral para gestionar cada módulo. Los cambios se reflejan en tiempo real en la PWA para los huéspedes.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
