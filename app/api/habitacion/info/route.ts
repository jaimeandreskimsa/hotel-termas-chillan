import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roomInfo } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const info = await db.select().from(roomInfo).orderBy(asc(roomInfo.order));
  return NextResponse.json({ info });
}
