import { db } from '../lib/db/index';
import { admins, spaSchedules, gymClasses, roomProducts } from '../lib/db/schema';
import { seedSpaSchedules, seedGymClasses, seedRoomProducts } from '../lib/db/seed-data';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash('admin123!', 10);
  await db.insert(admins).values({ email: 'superadmin@termaschillan.cl', password: hash, name: 'Super Administrador', role: 'superadmin' }).onConflictDoNothing();
  console.log('Admin ok');

  await db.insert(spaSchedules).values(seedSpaSchedules.map(s => ({ ...s, active: true }))).onConflictDoNothing();
  console.log('SPA schedules ok');

  await db.insert(gymClasses).values(seedGymClasses.map(c => ({ ...c, active: true }))).onConflictDoNothing();
  console.log('Gym classes ok');

  const prodResult = await db.insert(roomProducts).values(seedRoomProducts.map(p => ({ ...p, active: true }))).onConflictDoNothing().returning();
  console.log('Room products:', prodResult.length);

  console.log('Done');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
