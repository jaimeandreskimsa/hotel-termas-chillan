import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { restaurantItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const items = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, "lagrieta")).orderBy(asc(restaurantItems.order));
  return NextResponse.json({ items });
}
