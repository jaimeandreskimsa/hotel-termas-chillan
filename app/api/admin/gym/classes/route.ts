import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gymClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { autoTranslate } from "@/lib/deepl";

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
  const translations = await autoTranslate({ name: body.name, description: body.description });
  const [gymClass] = await db
    .insert(gymClasses)
    .values({ name: body.name, description: body.description, price: body.price, schedule: body.schedule, order: body.order ?? 99, translations })
    .returning();
  await logAction({ type: "admin", action: "create_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó clase gym: ${body.name}` });
  return NextResponse.json({ gymClass });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const translations = await autoTranslate({ name: body.name, description: body.description });
  const [gymClass] = await db
    .update(gymClasses)
    .set({ name: body.name, description: body.description, price: body.price, schedule: body.schedule, translations })
    .where(eq(gymClasses.id, body.id))
    .returning();
  await logAction({ type: "admin", action: "update_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó clase gym: ${body.name}` });
  return NextResponse.json({ gymClass });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(gymClasses).where(eq(gymClasses.id, body.id));
  await logAction({ type: "admin", action: "delete_service", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó clase gym id:${body.id}` });
  return NextResponse.json({ ok: true });
}
