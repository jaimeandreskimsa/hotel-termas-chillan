import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { restaurantItems } from "@/lib/db/schema";
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

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [item] = await db.insert(restaurantItems).values({ restaurant: body.restaurant, category: body.category, subcategory: body.subcategory, name: body.name, description: body.description, price: body.price, order: body.order ?? 99 }).returning();
  await logAction({ type: "admin", action: "create_item", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó ítem: ${body.name} en ${body.restaurant}` });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [item] = await db.update(restaurantItems).set({ category: body.category, subcategory: body.subcategory, name: body.name, description: body.description, price: body.price }).where(eq(restaurantItems.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_item", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó ítem: ${body.name}` });
  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(restaurantItems).where(eq(restaurantItems.id, body.id));
  await logAction({ type: "admin", action: "delete_item", module: "restaurantes", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó ítem id:${body.id}` });
  return NextResponse.json({ ok: true });
}
