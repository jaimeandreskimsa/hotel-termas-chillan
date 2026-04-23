import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(activities).orderBy(activities.season, asc(activities.order));
    return NextResponse.json({ activities: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
