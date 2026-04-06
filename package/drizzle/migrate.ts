import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);
console.log("Running migrations...");
await migrate(db, {
  migrationsFolder: path.resolve(__dirname, "../../../drizzle"),
});
console.log("Migrations complete!");

await pool.end();
process.exit(0);
