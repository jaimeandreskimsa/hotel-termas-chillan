import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { admins } from '../lib/db/schema';

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  const hash = await bcrypt.hash('admin123!', 10);
  const result = await db.insert(admins)
    .values({ email: 'superadmin@termaschillan.cl', password: hash, name: 'Super Administrador', role: 'superadmin' })
    .onConflictDoNothing()
    .returning();

  if (result.length) {
    console.log('✓ Admin creado:', result[0].email);
  } else {
    console.log('Admin ya existía, sin cambios');
  }

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
