import knex from 'knex';
import { postgresConfig } from './knexfile.ts';
import { getCurrEnvName } from './constants.ts';

const envName = getCurrEnvName();
const knexConfig = postgresConfig[envName];

const knexClient = knex(knexConfig);

await knexClient.raw(`SET search_path TO ${envName};`);

export { knexClient };
