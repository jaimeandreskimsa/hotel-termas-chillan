import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spaSchedules } from "@/lib/db/schema";

export async function GET() {
  const schedules = await db.select().from(spaSchedules);
  return NextResponse.json({ schedules });
}
