import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { systemSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const KEY = "spa_reglamento";

export async function GET() {
  const row = await db.select().from(systemSettings).where(eq(systemSettings.key, KEY)).limit(1);
  return NextResponse.json({ reglamento: row[0]?.value ?? "" });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "spa") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { reglamento } = await req.json() as { reglamento: string };

  const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, KEY)).limit(1);
  if (existing.length > 0) {
    await db.update(systemSettings).set({ value: reglamento, updatedAt: new Date() }).where(eq(systemSettings.key, KEY));
  } else {
    await db.insert(systemSettings).values({ key: KEY, value: reglamento });
  }

  return NextResponse.json({ ok: true });
}
