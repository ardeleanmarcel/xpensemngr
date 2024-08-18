import 'dotenv/config';

import { knexClient } from './knex_client.ts';

await knexClient.migrate.down();

process.exit();
