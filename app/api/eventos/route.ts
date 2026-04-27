import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(events).where(eq(events.active, true)).orderBy(events.order, events.createdAt);
  return NextResponse.json({ events: data });
}
