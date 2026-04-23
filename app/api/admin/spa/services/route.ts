import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { spaServices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function getSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "spa") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [service] = await db.insert(spaServices).values({ category: body.category, name: body.name, description: body.description, duration: body.duration, price: body.price, order: body.order ?? 99 }).returning();
  await logAction({ type: "admin", action: "create_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó servicio: ${body.name} (${body.category})` });
  return NextResponse.json({ service });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [service] = await db.update(spaServices).set({ category: body.category, name: body.name, description: body.description, duration: body.duration, price: body.price }).where(eq(spaServices.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó servicio: ${body.name}` });
  return NextResponse.json({ service });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(spaServices).where(eq(spaServices.id, body.id));
  await logAction({ type: "admin", action: "delete_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó servicio id:${body.id}` });
  return NextResponse.json({ ok: true });
}
