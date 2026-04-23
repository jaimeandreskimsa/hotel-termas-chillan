import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logAction } from "@/lib/logger";

async function getSuperAdminSession() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "superadmin") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const hash = await bcrypt.hash(body.password, 10);
  const [user] = await db.insert(admins).values({ name: body.name, email: body.email, password: hash, role: body.role, module: body.role === "admin" ? body.module : null }).returning({ id: admins.id, email: admins.email, name: admins.name, role: admins.role, module: admins.module, createdAt: admins.createdAt });
  await logAction({ type: "admin", action: "create_user", module: "usuarios", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó usuario: ${body.name} (${body.email}) rol:${body.role}` });
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(admins).where(eq(admins.id, body.id));
  await logAction({ type: "admin", action: "delete_user", module: "usuarios", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó usuario id:${body.id}` });
  return NextResponse.json({ ok: true });
}
