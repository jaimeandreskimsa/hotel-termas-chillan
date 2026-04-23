import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alerts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(alerts).where(eq(alerts.active, true)).orderBy(desc(alerts.createdAt));
  return NextResponse.json({ alerts: data });
}
