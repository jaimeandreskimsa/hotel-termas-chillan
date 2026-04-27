import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { restaurantSchedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function getSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "restaurantes") return null;
  return session;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schedules = await db.select().from(restaurantSchedules).orderBy(restaurantSchedules.restaurant, restaurantSchedules.id);
  return NextResponse.json({ schedules });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [schedule] = await db.insert(restaurantSchedules).values({ restaurant: body.restaurant, info: body.info, active: body.active ?? true }).returning();
  await logAction({ type: "admin", action: "create_schedule", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó horario en ${body.restaurant}: ${body.info}` });
  return NextResponse.json({ schedule });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const update: Partial<{ info: string; active: boolean }> = {};
  if (body.info !== undefined) update.info = body.info;
  if (body.active !== undefined) update.active = body.active;
  const [schedule] = await db.update(restaurantSchedules).set(update).where(eq(restaurantSchedules.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_schedule", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó horario id:${body.id}` });
  return NextResponse.json({ schedule });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(restaurantSchedules).where(eq(restaurantSchedules.id, body.id));
  await logAction({ type: "admin", action: "delete_schedule", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó horario id:${body.id}` });
  return NextResponse.json({ ok: true });
}
