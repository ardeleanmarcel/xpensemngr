import 'dotenv/config';
import knex from 'knex';

// because pg returns BIGINT as strings by default
import pg from 'pg';
pg.types.setTypeParser(20, function (val) {
  return parseInt(val, 10);
});

export const knexClient = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  // TODO (Valle) -> should config search path based on environment
  // TODO (Valle) -> setting the search path like this might be an improvement for "MYE databse"
  searchPath: ['development', 'public'],
});
