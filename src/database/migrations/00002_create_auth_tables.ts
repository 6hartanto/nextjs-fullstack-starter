import { Kysely, sql } from 'kysely'

import { KyselyDatabase } from '../client'
import {
  defaultJSONB,
  defaultTimestamp,
  PRIMARY_KEY_COLUMN,
  SOFT_DELETED_COLUMN,
  TIMESTAMPS_COLUMN,
} from '../common'

export async function up({ schema }: KyselyDatabase): Promise<void> {
  // --------------------------------------------------------------------------
  // Create `users` table
  // --------------------------------------------------------------------------
  await schema
    .createTable('users')
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('email', 'varchar', (col) => col.unique().notNull())
    .addColumn('first_name', 'varchar')
    .addColumn('last_name', 'varchar')
    .addColumn('prefered_username', 'varchar', (col) => col.unique())
    .addColumn('metadata', 'jsonb', (col) => col.defaultTo(defaultJSONB))
    .addColumn('email_confirmed_at', 'timestamp')
    .$call(TIMESTAMPS_COLUMN)
    .$call(SOFT_DELETED_COLUMN)
    .addCheckConstraint('prefered_username_length', sql`char_length(prefered_username) >= 4`)
    .execute()

  await schema.createIndex('users_email_index').on('users').column('email').execute()
  await schema
    .createIndex('users_prefered_username_index')
    .on('users')
    .column('prefered_username')
    .execute()

  // --------------------------------------------------------------------------
  // Create `user_keys` table
  // --------------------------------------------------------------------------
  await schema
    .createTable('user_keys')
    .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('no action').onUpdate('no action').notNull()
    )
    .addColumn('hashed_password', 'varchar')
    .$call(TIMESTAMPS_COLUMN)
    .execute()

  // --------------------------------------------------------------------------
  // Create `sessions` table
  // --------------------------------------------------------------------------
  await schema
    .createTable('sessions')
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('no action').onUpdate('no action').notNull()
    )
    .addColumn('provider_id', 'varchar(40)', (col) => col.notNull())
    .addColumn('active_expires', 'bigint', (col) => col.notNull())
    .addColumn('idle_expires', 'bigint', (col) => col.notNull())
    .addColumn('user_agent_hash', 'char(32)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(defaultTimestamp).notNull())
    .execute()

  await schema.createIndex('sessions_user_id_index').on('sessions').column('user_id').execute()

  // --------------------------------------------------------------------------
  // Create `tokens` table
  // --------------------------------------------------------------------------

  await schema
    .createTable('tokens')
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('no action').onUpdate('no action').notNull()
    )
    .addColumn('kind', 'varchar(100)', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('expires', 'bigint', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(defaultTimestamp).notNull())
    .execute()
}

export async function down({ schema }: KyselyDatabase): Promise<void> {
  await schema.dropTable('tokens').ifExists().execute()
  await schema.dropTable('sessions').ifExists().execute()
  await schema.dropTable('user_keys').ifExists().execute()
  await schema.dropTable('users').ifExists().execute()
}
