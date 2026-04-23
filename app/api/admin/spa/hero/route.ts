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
  if (role !== "superadmin" && module !== "spa") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [program] = await db
    .insert(familyPrograms)
    .values({ type: body.type, name: body.name ?? body.type, description: null, image: body.image, order: 0 })
    .returning();
  await logAction({ type: "admin", action: "update_hero", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó imagen hero: ${body.type}` });
  return NextResponse.json({ program });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [program] = await db
    .update(familyPrograms)
    .set({ image: body.image })
    .where(eq(familyPrograms.id, body.id))
    .returning();
  await logAction({ type: "admin", action: "update_hero", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó imagen hero id:${body.id}` });
  return NextResponse.json({ program });
}
