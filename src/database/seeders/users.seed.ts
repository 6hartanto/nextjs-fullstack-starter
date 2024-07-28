import { hashPassword } from "../../lib/security";
import { KyselyDatabase } from "../client";
import { UserKeyInsert } from "../tables/auth.table";
import { UserInsert } from "../tables/users.table";

export async function userSeeder(db: KyselyDatabase) {
  const newUsers: UserInsert[] = [
    {
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "Sistem",
      prefered_username: "admin",
      metadata: JSON.stringify({
        avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sassy",
      }),
      email_confirmed_at: new Date().toUTCString(),
    },
  ];

  await db.transaction().execute(async (trx) => {
    const hashed_password = await hashPassword("secret");

    const users = await trx
      .insertInto("users")
      .values(newUsers)
      .returning(["id", "email"])
      .execute();

    // Create authentication key for Lucia Auth
    const userKeys: UserKeyInsert[] = users.map((item) => ({
      id: `email:${item.email}`,
      user_id: item.id,
      hashed_password,
    }));

    return await trx.insertInto("user_keys").values(userKeys).execute();
  });
}
