import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gymClasses } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const classes = await db.select().from(gymClasses).orderBy(asc(gymClasses.order));
  return NextResponse.json({ classes });
}
