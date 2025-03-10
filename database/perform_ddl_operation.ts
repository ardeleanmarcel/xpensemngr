import 'dotenv/config';
import { knexClient } from './knex_client.ts';
import { isYes, log, rl, validateOperationName } from './utils.ts';
import { z } from 'zod';

enum DDL_OPERATION {
  CreateMigration = 'create_migration',
  MigrateAll = 'migrate_all',
  MigrateDown = 'migrate_down',
}

const operation = process.argv[2];

switch (operation) {
  case DDL_OPERATION.CreateMigration:
    await createMigration();
    break;
  case DDL_OPERATION.MigrateAll:
    await migrateAll();
    break;
  case DDL_OPERATION.MigrateDown:
    await migrateDown();
    break;
  default:
    const err = `Unknown operation: ${operation}`;
    log.error(err);
    throw new Error(err);
}

log.success('Operation successful!');
process.exit();

async function createMigration() {
  const mName = process.argv[3];

  validateOperationName(mName);

  const res = await knexClient.migrate.make(mName);

  log.info(`Created migration file: ${res}`);
}

async function migrateAll() {
  const res = await knexClient.migrate.latest();
  const parsedRes = z.tuple([z.number(), z.array(z.string())]).parse(res);

  const scripts = parsedRes[1].map((s) => '--> ' + s).join('\n');
  log.info(`The following DDL migrations have been run:\n${scripts}`);
}

async function migrateDown() {
  log.warn('This can lead to deleting data in the database!');

  const answer = await rl.question('Are you sure you want to continue? (yes/no) ');

  if (!isYes(answer)) {
    log.info('Aborting...');
    process.exit(0);
  }

  log.info('Migrating down...');
  const res = await knexClient.migrate.down();

  log.info(`The following DDL migration script was rolled back:\n --> ${res[1][0]}`);

  log.info('Migration down successful!');
}
