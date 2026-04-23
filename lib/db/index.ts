import * as schema from "./schema";

const url = process.env.DATABASE_URL!;

// Use neon-http for remote Neon instances, postgres driver for local
function createDb() {
  if (url.includes("neon.tech") || url.includes("neon.database")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const postgres = require("postgres");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/postgres-js");
    return drizzle(postgres(url), { schema });
  }
}

export const db = createDb();
