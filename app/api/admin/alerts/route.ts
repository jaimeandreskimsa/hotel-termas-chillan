import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { alerts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function checkAuth() {
  const session = await auth();
  return !!session ? session : null;
}

export async function GET() {
  const data = await db.select().from(alerts).orderBy(alerts.createdAt);
  return NextResponse.json({ alerts: data });
}

export async function POST(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [alert] = await db.insert(alerts).values({ title: body.title, message: body.message, type: body.type ?? "info", active: true }).returning();
  await logAction({ type: "admin", action: "create_alert", module: "alertas", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó alerta: ${body.title}` });
  return NextResponse.json({ alert });
}

export async function PATCH(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [alert] = await db.update(alerts).set({ title: body.title, message: body.message, type: body.type, active: body.active }).where(eq(alerts.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_alert", module: "alertas", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó alerta id:${body.id} active:${body.active}` });
  return NextResponse.json({ alert });
}

export async function DELETE(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(alerts).where(eq(alerts.id, body.id));
  await logAction({ type: "admin", action: "delete_alert", module: "alertas", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó alerta id:${body.id}` });
  return NextResponse.json({ ok: true });
}
