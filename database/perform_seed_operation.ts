import 'dotenv/config';
import { knexClient } from './knex_client.ts';
import { isYes, log, rl, validateOperationName } from './utils.ts';
import { z } from 'zod';

const seedRunResultSchema = z.array(z.array(z.string()));

enum SEED_OPERATION {
  CreateSeed = 'create_seed',
  SeedAll = 'seed_all',
}

const operation = process.argv[2];

switch (operation) {
  case SEED_OPERATION.CreateSeed:
    await createSeed();
    break;
  case SEED_OPERATION.SeedAll:
    await seedAll();
    break;
  default:
    const err = `Unknown operation: ${operation}`;
    log.error(err);
    throw new Error(err);
}

log.success('Operation successful!');
process.exit();

async function createSeed() {
  const sName = process.argv[3];

  validateOperationName(sName);

  const res = await knexClient.seed.make(sName, { extension: 'ts' });
  console.log('res', res);

  log.info(`Created seed file: ${res}`);
}

async function seedAll() {
  log.warn('This will add data in the database!');

  const answer = await rl.question('Are you sure you want to continue? (yes/no) ');

  if (!isYes(answer)) {
    log.info('Aborting...');
    process.exit();
  }

  const seedScripts: string[] = [];

  log.info('Seeding users...');
  const usersRes = await knexClient.seed.run({ specific: 'users.ts' });
  const parsedUsersRes = seedRunResultSchema.parse(usersRes);
  seedScripts.push(parsedUsersRes[0][0]);
  log.info('Seeding users successful!');

  const seedList = seedScripts.map((s) => '--> ' + s).join('\n');
  log.info(`The following seed scripts have been run:\n${seedList}`);
}
