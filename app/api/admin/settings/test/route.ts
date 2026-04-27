import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { systemSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let apiKey = process.env.DEEPL_API_KEY;
  let plan = "free";

  const [keyRow] = await db.select().from(systemSettings).where(eq(systemSettings.key, "deepl_api_key")).limit(1);
  const [planRow] = await db.select().from(systemSettings).where(eq(systemSettings.key, "deepl_plan")).limit(1);
  if (keyRow?.value) apiKey = keyRow.value;
  if (planRow?.value) plan = planRow.value;

  if (!apiKey) return NextResponse.json({ ok: false, error: "No hay API key configurada" });

  const apiUrl = plan === "free"
    ? "https://api-free.deepl.com/v2/usage"
    : "https://api.deepl.com/v2/usage";

  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `DeepL respondió con status ${res.status}` });
    }
    const data = await res.json() as { character_count?: number; character_limit?: number };
    return NextResponse.json({
      ok: true,
      character_count: data.character_limit !== undefined
        ? `${data.character_count?.toLocaleString()} / ${data.character_limit?.toLocaleString()}`
        : data.character_count,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo conectar con DeepL" });
  }
}
