// TODO (Valle) -> consolidate commands into single file?
import 'dotenv/config';

import { knexClient } from './knex_client.ts';

const nameInput = process.argv[2];

if (!nameInput) throw new Error('Migration name is missing!');

const res = await knexClient.migrate.make(nameInput);

console.log('[MYE] Created migration file: ', res);

process.exit();
