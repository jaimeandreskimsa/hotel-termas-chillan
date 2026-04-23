import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import UsuariosClient from "./UsuariosClient";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";

export default async function UsuariosPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") redirect("/admin");

  const users = await db.select({ id: admins.id, email: admins.email, name: admins.name, role: admins.role, module: admins.module, createdAt: admins.createdAt }).from(admins);
  return <AdminShell><UsuariosClient initialUsers={users} /></AdminShell>;
}
