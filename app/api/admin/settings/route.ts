import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { systemSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

const ALLOWED_KEYS = ["deepl_api_key", "deepl_plan", "translation_enabled"];

async function getSuperadminSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") return null;
  return session;
}

export async function GET() {
  const session = await getSuperadminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(systemSettings);
  // Mask API key value — return only whether it's set
  const settings: Record<string, string | null> = {};
  for (const row of rows) {
    if (row.key === "deepl_api_key") {
      settings[row.key] = row.value ? "****" + row.value.slice(-4) : null;
    } else {
      settings[row.key] = row.value;
    }
  }
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await getSuperadminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Record<string, string>;

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(systemSettings).set({ value, updatedAt: new Date() }).where(eq(systemSettings.key, key));
    } else {
      await db.insert(systemSettings).values({ key, value });
    }
  }

  await logAction({
    type: "admin",
    action: "update_settings",
    module: "configuracion",
    actorName: session.user?.name,
    actorEmail: session.user?.email,
    details: `Actualizó configuración: ${Object.keys(body).join(", ")}`,
  });

  return NextResponse.json({ ok: true });
}
