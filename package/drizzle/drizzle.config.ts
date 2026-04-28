import type { Config } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error(
    "Missing DATABASE_URL environment variable. Set it before running migrations"
  );
}

export default {
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  out: "../../drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
} satisfies Config;
