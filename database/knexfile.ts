import { Knex } from 'knex';
import { ENV_NAME, EnvName } from './constants.ts';

// example of async password retrieval
const getPassword = async () => {
  // TODO (Valle) -> retrieve password from AWS secrets manager
  return process.env.PROD_DB_PASS;
};

const stubFile = 'migration.stub';

// TODO (Valle) -> string key should be a valid env name
export const postgresConfig: { [key in EnvName]: Knex.Config } = {
  [ENV_NAME.development]: {
    client: 'pg',
    connection: {
      host: process.env.LOCAL_DB_HOST,
      port: parseInt(process.env.LOCAL_DB_PORT ?? '3000'),
      database: process.env.LOCAL_DB_NAME,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASS,
    },
    migrations: {
      stub: stubFile,
      schemaName: ENV_NAME.development,
      extension: 'ts',
    },
  },
  [ENV_NAME.production]: {
    client: 'pg',
    connection: async () => {
      const password = await getPassword();

      return {
        host: process.env.PROD_DB_HOST,
        port: parseInt(process.env.PROD_DB_PORT ?? '5432'),
        database: process.env.PROD_DB_NAME,
        user: process.env.PROD_DB_USER,
        password,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    },
    migrations: {
      stub: stubFile,
      schemaName: ENV_NAME.production,
      extension: 'ts',
    },
  },
};
