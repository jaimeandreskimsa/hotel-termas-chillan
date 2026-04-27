import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { restaurantSchedules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const restaurant = req.nextUrl.searchParams.get("restaurant");
  if (!restaurant) return NextResponse.json({ error: "Missing restaurant" }, { status: 400 });
  const schedules = await db.select().from(restaurantSchedules).where(and(eq(restaurantSchedules.restaurant, restaurant), eq(restaurantSchedules.active, true))).orderBy(restaurantSchedules.id);
  return NextResponse.json({ schedules });
}
