import { Knex } from 'knex';
import { knexClient } from '@src/db/client.ts';

class SqlClient {
  private client: Knex;
  constructor() {
    this.client = knexClient;
  }

  // TODO (Valle) -> consolidate query and queryWithParams into single query function with optional second param
  // TODO (Valle) -> client queries should be wrapped in try/catch and return an appropriate HttpError

  public async query<T>(text: string) {
    const res = await this.client.raw(text);

    return res.rows as T[];
  }

  // TODO (Valle) -> check if an empty array as bindings when no params are needed is accepted
  // by the client.raw method
  public async queryWithParams<T>(text: string, bindings: Knex.RawBinding) {
    const res = await this.client.raw(text, bindings);

    return res.rows as T[];
  }
}

export const sqlClient = new SqlClient();
