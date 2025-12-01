import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function migrationsHandler(options) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await migrationRunner({
      dbClient,
      ...defaultMigrationsOptions,
      ...options,
    });
  } finally {
    await dbClient.end();
  }
}

async function getHandler(request, response) {
  const pendingMigrations = await migrationsHandler();
  response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrationsHandler({
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
