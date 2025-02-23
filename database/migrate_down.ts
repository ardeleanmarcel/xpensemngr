import 'dotenv/config';

import { knexClient } from './knex_client.ts';

// TODO (Valle) -> add some logs to know that all went well
await knexClient.migrate.down();

process.exit();
