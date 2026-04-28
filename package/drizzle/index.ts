import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  logger: true,
});

export * from "./src/db/schema.js";
export * from "./src/db/auth-schema.js";
