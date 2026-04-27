import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function checkAuth() {
  const session = await auth();
  return session ?? null;
}

export async function GET() {
  const data = await db.select().from(events).orderBy(events.order, events.createdAt);
  return NextResponse.json({ events: data });
}

export async function POST(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [event] = await db.insert(events).values({
    day: body.day,
    month: body.month,
    time: body.time,
    title: body.title,
    description: body.description ?? null,
    location: body.location ?? null,
    active: true,
    order: body.order ?? 0,
  }).returning();
  await logAction({ type: "admin", action: "create_event", module: "eventos", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó evento: ${body.title}` });
  return NextResponse.json({ event });
}

export async function PATCH(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [event] = await db.update(events).set({
    day: body.day,
    month: body.month,
    time: body.time,
    title: body.title,
    description: body.description ?? null,
    location: body.location ?? null,
    active: body.active,
    order: body.order ?? 0,
  }).where(eq(events.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_event", module: "eventos", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó evento id:${body.id}` });
  return NextResponse.json({ event });
}

export async function DELETE(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(events).where(eq(events.id, body.id));
  await logAction({ type: "admin", action: "delete_event", module: "eventos", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó evento id:${body.id}` });
  return NextResponse.json({ ok: true });
}
