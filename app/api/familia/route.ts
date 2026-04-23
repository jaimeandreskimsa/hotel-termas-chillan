import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { familyPrograms } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const programs = await db.select().from(familyPrograms).orderBy(asc(familyPrograms.order));
  return NextResponse.json({ programs });
}
