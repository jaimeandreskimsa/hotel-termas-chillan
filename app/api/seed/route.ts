import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins, spaServices, spaSchedules, gymClasses, restaurantItems, activities, familyPrograms, roomProducts, roomInfo } from "@/lib/db/schema";
import { seedSpaServices, seedSpaSchedules, seedGymClasses, seedRestaurantItems, seedActivities, seedFamilyPrograms, seedRoomProducts, seedRoomInfo } from "@/lib/db/seed-data";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Super admin
  const hash = await bcrypt.hash("admin123!", 10);
  await db.insert(admins).values({ email: "superadmin@termaschillan.cl", password: hash, name: "Super Administrador", role: "superadmin" }).onConflictDoNothing();

  // Seed all content
  await db.insert(spaServices).values(seedSpaServices.map(s => ({ ...s, active: true }))).onConflictDoNothing();
  await db.insert(spaSchedules).values(seedSpaSchedules.map(s => ({ ...s, active: true }))).onConflictDoNothing();
  await db.insert(gymClasses).values(seedGymClasses.map(c => ({ ...c, active: true }))).onConflictDoNothing();
  await db.insert(restaurantItems).values(seedRestaurantItems.map(i => ({ ...i, active: true }))).onConflictDoNothing();
  await db.insert(activities).values(seedActivities.map(a => ({ ...a, active: true }))).onConflictDoNothing();
  await db.insert(familyPrograms).values(seedFamilyPrograms.map(p => ({ ...p, active: true }))).onConflictDoNothing();
  await db.insert(roomProducts).values(seedRoomProducts.map(p => ({ ...p, active: true }))).onConflictDoNothing();
  await db.insert(roomInfo).values(seedRoomInfo.map(i => ({ ...i, active: true }))).onConflictDoNothing();

  return NextResponse.json({ ok: true, message: "Seed completado exitosamente" });
}
