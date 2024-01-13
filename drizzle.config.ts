import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    // uri: process.env.DATABASE_URL!,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    port: parseInt(process.env.DB_PORT!),
    // connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;