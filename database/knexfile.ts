import { Knex } from 'knex';
import { ENV_NAME, EnvName } from './constants.ts';

// example of async password retrieval
const getPassword = async () => {
  return 'my_pass';
};

const stubFile = 'migration.stub';

// TODO (Valle) -> string key should be a valid env name
export const postgresConfig: { [key in EnvName]: Knex.Config } = {
  [ENV_NAME.development]: {
    client: 'pg',
    connection: {
      host: process.env.LOCAL_DB_HOST,
      port: parseInt(process.env.LOCAL_DB_PORT || '3000'),
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

  // TODO (Valle) -> update prod data
  production: {
    client: 'pg',
    connection: async () => {
      const password = await getPassword();
      return { user: 'me', password };
    },
  },
};
