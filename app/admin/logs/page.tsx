import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import LogsClient from "./LogsClient";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export default async function LogsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") redirect("/admin");

  const logs = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(200);

  const [guestCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(activityLogs)
    .where(eq(activityLogs.type, "guest"));

  const [adminCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(activityLogs)
    .where(eq(activityLogs.type, "admin"));

  return (
    <AdminShell>
      <LogsClient
        initialLogs={logs.map((l: typeof logs[number]) => ({
          ...l,
          createdAt: l.createdAt?.toISOString() ?? new Date().toISOString(),
        }))}
        summary={{ guests: guestCount.value, admins: adminCount.value }}
      />
    </AdminShell>
  );
}
