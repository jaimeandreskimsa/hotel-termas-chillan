import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { familyPrograms } from "@/lib/db/schema";
import FamiliaAdminClient from "./FamiliaAdminClient";

export default async function FamiliaAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "familia") redirect("/admin");

  const programs = await db.select().from(familyPrograms).orderBy(familyPrograms.type, familyPrograms.order);
  return <AdminShell><FamiliaAdminClient initialPrograms={programs} /></AdminShell>;
}
