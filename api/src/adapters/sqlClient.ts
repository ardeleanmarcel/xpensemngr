import { Knex } from 'knex';
import { knexClient } from '@src/db/client.ts';

type QueryParams = Array<string | number | null | Array<string | number>>;

class SqlClient {
  private readonly client: Knex;
  constructor() {
    this.client = knexClient;
  }

  // TODO (Valle) -> client queries should be wrapped in try/catch and return an appropriate HttpError

  public async query<T>(statement: string, params: QueryParams = []) {
    const res = await this.client.raw(statement, params);

    return res.rows as T[];
  }
}

export const sqlClient = new SqlClient();
