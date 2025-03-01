import { Knex } from 'knex';
import { knexClient } from '@src/db/client.ts';
import { log } from '@xpm/logging';
import { HTTP_ERR } from '@src/errors/http.errors.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';

type QueryParams = Array<string | number | null | Array<string | number>>;

class SqlClient {
  private readonly client: Knex;
  constructor() {
    this.client = knexClient;
  }

  public async query<T>(statement: string, params: QueryParams = []) {
    try {
      const res = await this.client.raw(statement, params);

      return res.rows as T[];
    } catch (error) {
      log.error(`Could not execute query:\n${statement}`);
      if (error instanceof Error) log.error(`Reason: ${error.message || 'unknown'}`);
      throwHttpError(HTTP_ERR.e500.Unavailable);
    }
  }
}

export const sqlClient = new SqlClient();
