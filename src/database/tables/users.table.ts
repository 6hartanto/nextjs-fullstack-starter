import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

import { WithSoftDeleteSchema, WithTimeStampSchema } from '../common'

export interface UsersTable extends WithTimeStampSchema, WithSoftDeleteSchema {
  id: Generated<string>
  email: string
  first_name: string
  last_name: string | null
  prefered_username: string | null
  email_confirmed_at: ColumnType<Date, string | undefined, never>
  // You can specify JSON columns using the `JSONColumnType` wrapper.
  // It is a shorthand for `ColumnType<T, string, string>`, where T
  // is the type of the JSON object/array retrieved from the database,
  // and the insert and update types are always `string` since you're
  // always stringifying insert/update values.
  metadata: JSONColumnType<{
    avatar_url: string | null
  }>
}

export type User = Selectable<UsersTable>
export type UserInsert = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>
