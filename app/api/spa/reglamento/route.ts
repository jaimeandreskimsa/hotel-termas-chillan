import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systemSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const row = await db.select().from(systemSettings).where(eq(systemSettings.key, "spa_reglamento")).limit(1);
  return NextResponse.json({ reglamento: row[0]?.value ?? "" });
}
