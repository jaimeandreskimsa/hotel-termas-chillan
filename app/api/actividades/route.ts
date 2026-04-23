import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(activities).orderBy(activities.season, asc(activities.order));
  return NextResponse.json({ activities: data });
}
