import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spaServices } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const services = await db.select().from(spaServices).orderBy(spaServices.category, asc(spaServices.order));
  return NextResponse.json({ services });
}
