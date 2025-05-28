import { XPM_ENV } from '@src/constants/env.const.ts';
import { ENV_VARS } from '@src/utils/env.utils.ts';
import knex from 'knex';

// because pg returns INT8 values as strings by default
import pg from 'pg';
pg.types.setTypeParser(pg.types.builtins.INT8, function (val) {
  return parseInt(val, 10);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, function (val) {
  return parseFloat(val);
});

pg.types.setTypeParser(pg.types.builtins.DATE, function (val) {
  return val;
});

// TODO (Valle) -> get config from aws secretes manager
const config: knex.Knex.Config = {
  client: 'pg',
  connection: {
    host: ENV_VARS.DB_HOST,
    port: ENV_VARS.DB_PORT,
    database: ENV_VARS.DB_NAME,
    user: ENV_VARS.DB_USER,
    password: ENV_VARS.DB_PASS,
    ssl:
      ENV_VARS.XPM_ENV === XPM_ENV.Production
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  },
  // TODO (Valle) -> setting the search path like this might be an improvement for "MYE databse"
  searchPath: [ENV_VARS.XPM_ENV, 'public'],
};

export const knexClient = knex(config);
