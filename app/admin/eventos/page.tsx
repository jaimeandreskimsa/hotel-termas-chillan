import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EventosAdminClient from "./EventosAdminClient";

export default async function EventosPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") redirect("/admin");
  return <EventosAdminClient />;
}
