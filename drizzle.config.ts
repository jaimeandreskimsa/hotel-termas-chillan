import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL!;
const isNeon = url?.includes("neon.tech") || url?.includes("neon.database");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  driver: isNeon ? undefined : undefined,
  dbCredentials: {
    url,
  },
});
