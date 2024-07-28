import { SessionsTable, TokensTable, UserKeysTable } from "./tables/auth.table";
import { UsersTable } from "./tables/users.table";

export interface Database {
  users: UsersTable;
  user_keys: UserKeysTable;
  sessions: SessionsTable;
  tokens: TokensTable;
}
