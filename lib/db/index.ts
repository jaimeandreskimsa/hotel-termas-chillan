import * as schema from "./schema";

// Use neon-http for remote Neon instances, postgres driver for local
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = any;

let _db: AnyDb | null = null;

function createDb(): AnyDb {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");
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

// Lazy proxy — DB is only initialized on first actual use (not at import time)
export const db: AnyDb = new Proxy({} as AnyDb, {
  get(_, prop: string | symbol) {
    if (!_db) _db = createDb();
    const val = (_db as AnyDb)[prop];
    // Bind methods to the real DB instance so Drizzle's internal `this` references work
    if (typeof val === "function") return val.bind(_db);
    return val;
  },
});
