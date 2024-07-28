import { Kysely, sql } from 'kysely'

import { KyselyDatabase } from '../client'

export async function up(db: KyselyDatabase): Promise<void> {
  await sql`set timezone='UTC'`.execute(db) // Set Postgres timezone
  await sql`create extension if not exists "uuid-ossp"`.execute(db)
}

export async function down(db: KyselyDatabase): Promise<void> {
  await sql`drop extension if exists "uuid-ossp"`.execute(db)
}
