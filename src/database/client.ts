import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "@/config";
import { Database } from "./schema";

export type KyselyDatabase = Kysely<Database>;

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db: KyselyDatabase = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  log: env.APP_ENV === "development" ? ["error"] : ["error"],
  plugins: [],
});

export default db;
