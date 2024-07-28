import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

import { WithTimeStampSchema } from '../common'

export interface UserKeysTable extends WithTimeStampSchema {
  id: Generated<string>
  user_id: string
  hashed_password: string
}

export type UserKey = Selectable<UserKeysTable>
export type UserKeyInsert = Insertable<UserKeysTable>
export type UserKeyUpdate = Updateable<UserKeysTable>

export interface SessionsTable {
  id: Generated<string>
  user_id: string
  provider_id: string
  active_expires: string
  idle_expires: string
  user_agent_hash: string
  created_at: ColumnType<Date, string | undefined, never>
}

export type Session = Selectable<SessionsTable>
export type SessionInsert = Insertable<SessionsTable>
export type SessionUpdate = Updateable<SessionsTable>

export interface TokensTable extends WithTimeStampSchema {
  id: Generated<string>
  user_id: string
  kind: string
  token: string
  expires: ColumnType<Date, string | undefined, never>
  created_at: ColumnType<Date, string | undefined, never>
}

export type Token = Selectable<TokensTable>
export type TokenInsert = Insertable<TokensTable>
export type TokenUpdate = Updateable<TokensTable>
