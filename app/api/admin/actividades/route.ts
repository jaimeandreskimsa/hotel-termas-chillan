import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function getSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "actividades") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [activity] = await db.insert(activities).values({ season: body.season, category: body.category, name: body.name, description: body.description, price: body.price, image: body.image ?? null, order: body.order ?? 99 }).returning();
  await logAction({ type: "admin", action: "create_activity", module: "actividades", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó actividad: ${body.name} (${body.season})` });
  return NextResponse.json({ activity });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [activity] = await db.update(activities).set({ season: body.season, category: body.category, name: body.name, description: body.description, price: body.price, image: body.image ?? null }).where(eq(activities.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_activity", module: "actividades", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó actividad: ${body.name}` });
  return NextResponse.json({ activity });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(activities).where(eq(activities.id, body.id));
  await logAction({ type: "admin", action: "delete_activity", module: "actividades", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó actividad id:${body.id}` });
  return NextResponse.json({ ok: true });
}
