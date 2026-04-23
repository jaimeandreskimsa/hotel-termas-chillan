import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { roomProducts, roomInfo } from "@/lib/db/schema";
import HabitacionAdminClient from "./HabitacionAdminClient";

export default async function HabitacionAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "habitacion") redirect("/admin");

  const products = await db.select().from(roomProducts).orderBy(roomProducts.category, roomProducts.order);
  const info = await db.select().from(roomInfo).orderBy(roomInfo.order);
  return <AdminShell><HabitacionAdminClient initialProducts={products} initialInfo={info} /></AdminShell>;
}
