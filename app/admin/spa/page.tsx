import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import SpaAdminClient from "./SpaAdminClient";
import { db } from "@/lib/db";
import { spaServices, spaSchedules, gymClasses, familyPrograms } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export default async function SpaAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "spa") redirect("/admin");

  const services = await db.select().from(spaServices).orderBy(spaServices.category, spaServices.order);
  const schedules = await db.select().from(spaSchedules);
  const classes = await db.select().from(gymClasses).orderBy(gymClasses.order);
  const programs = await db.select().from(familyPrograms).where(inArray(familyPrograms.type, ["hero_spa", "hero_gimnasio"]));

  return (
    <AdminShell>
      <SpaAdminClient initialServices={services} initialSchedules={schedules} initialClasses={classes} initialPrograms={programs} />
    </AdminShell>
  );
}
