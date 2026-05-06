import { db } from '../lib/db/index';
import { admins, spaServices, spaSchedules, gymClasses, restaurantItems, activities, familyPrograms, roomProducts, roomInfo } from '../lib/db/schema';
import { seedSpaServices, seedSpaSchedules, seedGymClasses, seedRestaurantItems, seedActivities, seedFamilyPrograms, seedRoomProducts, seedRoomInfo } from '../lib/db/seed-data';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting production seed...');

  const hash = await bcrypt.hash('admin123!', 10);
  await db.insert(admins).values({ email: 'superadmin@termaschillan.cl', password: hash, name: 'Super Administrador', role: 'superadmin' }).onConflictDoNothing();
  console.log('Admin inserted');

  const spaResult = await db.insert(spaServices).values(seedSpaServices.map(s => ({ ...s, active: true }))).onConflictDoNothing().returning();
  console.log('SPA services:', spaResult.length);

  const spaSchResult = await db.insert(spaSchedules).values(seedSpaSchedules.map(s => ({ ...s, active: true }))).onConflictDoNothing().returning();
  console.log('SPA schedules:', spaSchResult.length);

  const gymResult = await db.insert(gymClasses).values(seedGymClasses.map(c => ({ ...c, active: true }))).onConflictDoNothing().returning();
  console.log('Gym classes:', gymResult.length);

  const restResult = await db.insert(restaurantItems).values(seedRestaurantItems.map(i => ({ ...i, active: true }))).onConflictDoNothing().returning();
  console.log('Restaurant items:', restResult.length);

  const actResult = await db.insert(activities).values(seedActivities.map(a => ({ ...a, active: true }))).onConflictDoNothing().returning();
  console.log('Activities:', actResult.length);

  const famResult = await db.insert(familyPrograms).values(seedFamilyPrograms.map(p => ({ ...p, active: true }))).onConflictDoNothing().returning();
  console.log('Family programs:', famResult.length);

  const roomProdResult = await db.insert(roomProducts).values(seedRoomProducts.map(p => ({ ...p, active: true }))).onConflictDoNothing().returning();
  console.log('Room products:', roomProdResult.length);

  const roomInfoResult = await db.insert(roomInfo).values(seedRoomInfo.map(i => ({ ...i, active: true }))).onConflictDoNothing().returning();
  console.log('Room info:', roomInfoResult.length);

  console.log('Seed completed!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
