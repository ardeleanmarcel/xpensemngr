import 'dotenv/config';

import { knexClient } from './knex_client.ts';
import { isYes, log, rl } from './utils.ts';

log.error('Warning! This can lead to deleting data in the database!');

const answer = await rl.question('Are you sure you want to continue? (yes/no) ');

if (!isYes(answer)) {
  log.info('Aborting...');
  process.exit(0);
}

log.info('Migrating down...');
const res = await knexClient.migrate.down();

log.info(`The following migration wes rolled back:\n --> ${res[1][0]}`);

log.success('Migration down successful!');
process.exit();
