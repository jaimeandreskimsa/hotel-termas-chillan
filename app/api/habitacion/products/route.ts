import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roomProducts } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const products = await db.select().from(roomProducts).orderBy(roomProducts.category, asc(roomProducts.order));
  return NextResponse.json({ products });
}
