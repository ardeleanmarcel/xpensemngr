import { Knex } from 'knex';
import { knexClient } from '@src/db/client.ts';
import { log } from '@xpm/logging';
import { HTTP_ERR } from '@src/errors/http.errors.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { SqlQueryBindings } from '@src/db/sql/types/sql.types.ts';

export interface SqlTransaction {
  query: <T>(statement: string, params: SqlQueryBindings) => Promise<Array<T>>;
  commit: () => Promise<unknown>;
  rollback: () => Promise<unknown>;
}

class SqlClient {
  private readonly client: Knex;
  constructor() {
    this.client = knexClient;
  }

  private async createTransaction(): Promise<SqlTransaction> {
    // TODO (Valle) -> add a way to close the transaction if nothing happens for 2 seconds
    const trx = await this.client.transaction();

    return {
      query: async <T>(statement: string, params: SqlQueryBindings) => {
        const res = await trx.raw(statement, params);

        return res.rows as T[];
      },
      commit: () => trx.commit(),
      rollback: () => trx.rollback(),
    };
  }

  // TODO (Valle) -> remove type generic and casting
  public async query<T>(statement: string, params: SqlQueryBindings = []) {
    try {
      const res = await this.client.raw(statement, params);

      return res.rows as T[];
    } catch (error) {
      log.error(`Could not execute query:\n${statement}`);
      if (error instanceof Error) log.error(`Reason: ${error.message || 'unknown'}`);
      throwHttpError(HTTP_ERR.e500.Unavailable);
    }
  }

  public getTransaction() {
    return this.createTransaction();
  }
}

export const sqlClient = new SqlClient();
