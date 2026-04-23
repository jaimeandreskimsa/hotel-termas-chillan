import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { activities, roomInfo } from "@/lib/db/schema";
import { like } from "drizzle-orm";
import ActividadesAdminClient from "./ActividadesAdminClient";

export default async function ActividadesAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "actividades") redirect("/admin");

  const data = await db.select().from(activities).orderBy(activities.season, activities.category, activities.order);
  const catImages = await db.select().from(roomInfo).where(like(roomInfo.section, "act_cat_%"));
  return <AdminShell><ActividadesAdminClient initialActivities={data} initialCatImages={catImages} /></AdminShell>;
}
