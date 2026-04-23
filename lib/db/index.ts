import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import postgres from "postgres";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";

const url = process.env.DATABASE_URL ?? "";

export const db = url.includes("neon.tech") || url.includes("neon.database")
  ? neonDrizzle(neon(url), { schema })
  : postgresDrizzle(postgres(url || "postgresql://ravenswood:ravenswood_secret@localhost:5433/hoteltermas"), { schema });
