import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { familyPrograms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function getSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "familia") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [program] = await db.insert(familyPrograms).values({ type: body.type, name: body.name, description: body.description, schedule: body.schedule, season: body.season, image: body.image ?? null, order: body.order ?? 99 }).returning();
  await logAction({ type: "admin", action: "create_program", module: "familia", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó programa: ${body.name} (${body.type})` });
  return NextResponse.json({ program });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [program] = await db.update(familyPrograms).set({ type: body.type, name: body.name, description: body.description, schedule: body.schedule, season: body.season, image: body.image ?? null }).where(eq(familyPrograms.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_program", module: "familia", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó programa: ${body.name}` });
  return NextResponse.json({ program });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(familyPrograms).where(eq(familyPrograms.id, body.id));
  await logAction({ type: "admin", action: "delete_program", module: "familia", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó programa id:${body.id}` });
  return NextResponse.json({ ok: true });
}
