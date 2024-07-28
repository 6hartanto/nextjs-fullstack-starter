import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from "kysely";
import { promises as fs } from "node:fs";
import path, { join } from "node:path";
import db from "./client";
import { userSeeder } from "./seeders/users.seed";

const migrationFolder = join(__dirname, "migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({ fs, path, migrationFolder }),
  migrationTableName: "_migration",
  migrationLockTableName: "_migration_lock",
  allowUnorderedMigrations: false,
});

async function runMigration(action: "migrate" | "rollback") {
  const { error, results } =
    action == "rollback"
      ? await migrator.migrateDown()
      : await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.info(
        `🍀 migration "${it.migrationName}" was executed successfully`
      );
    } else if (it.status === "Error") {
      console.error(`🔥 failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("🔥 failed to migrate");
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

async function resetMigration() {
  await migrator
    .migrateTo(NO_MIGRATIONS)
    .then(() => {
      console.info("🍀 Database reset succeed");
      process.exit(0);
    })
    .catch((e) => {
      console.error("🔥 Failed to reset database:", e.message);
      process.exit(1);
    })
    .finally(async () => await db.destroy());
}

async function runSeeder() {
  const seeds = async () => {
    await userSeeder(db);
  };

  seeds()
    .then(async () => {
      console.info("🍀 Database has been populated with seeders");
      process.exit(0);
    })
    .catch(async (e) => {
      console.error("🔥 Failed running database seeder:", e.message);
      process.exit(1);
    })
    .finally(async () => await db.destroy());
}

switch (process.argv[2]) {
  case "migrate":
    console.info("🍀 Running database migration...");
    runMigration("migrate");
    break;
  case "rollback":
    console.info("🍀 Rolling back migration...");
    runMigration("rollback");
    break;
  case "reset":
    console.info("🍀 Refresh database migration...");
    resetMigration();
    break;
  case "seed":
    console.info("🍀 Populating database with seeders...");
    runSeeder();
    break;
  default:
    console.warn("🔥 Invalid argument provided!");
    break;
}
