import 'dotenv/config';

import { knexClient } from './knex_client.ts';
import { getCurrEnvName } from './constants.ts';

const envName = getCurrEnvName();
console.log('Creating schema for environment: ', envName);

await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS ${envName};`);
await knexClient.raw(`SET search_path TO ${envName};`);
await knexClient.migrate.latest();

process.exit();
