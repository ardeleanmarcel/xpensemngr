import { z } from 'zod';
import { sqlClient, SqlTransaction } from '@src/services/database/client.sql.ts';
import { ExpenseCreateType, expenseSchema } from '@src/domains/expenses/expense.models.ts';
import { Filter } from '../database.utils.ts';
import {
  composeLimitClause,
  composeOrderByClause,
  composeWhereClause,
  getSqlQueryBindings,
} from './utils/sql.utils.ts';
import { labelSchema } from '@src/models/label.models.ts';
import { OrderBy } from './types/sql.types.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { HTTP_ERR } from '@src/errors/http.errors.ts';
import { log } from '@xpm/logging';

export async function createExpensesWithLabels(expenses: ExpenseCreateType, user_id: number) {
  const transaction = await sqlClient.getTransaction();
  try {
    const insertedExpenses = await createExpenses(expenses, user_id, transaction);

    // because Postgres guarantees the order of the returning IDs, we can rely on it to map the labels
    await addLabelsToExpenses(
      insertedExpenses.map((exp, idx) => ({ expense_id: exp.expense_id, label_ids: expenses[idx].label_ids })),
      transaction
    );

    await transaction.commit();

    return insertedExpenses.map((exp) => exp.expense_id);
  } catch (error) {
    await transaction.rollback();
    log.error(`Could not create expenses with labels. Reason:\n${JSON.stringify(error) || 'unknown'}`);
    throw throwHttpError(HTTP_ERR.e500.Unavailable);
  }
}

export async function createExpenses(expenses: ExpenseCreateType, user_id: number, transaction?: SqlTransaction) {
  const queryValues = new Array(expenses.length)
    .fill(null)
    .map(() => `( ?, ?, ?, ? )`)
    .join(',\n');

  const query = `
      INSERT INTO expenses
        (description, amount, date_expended_at, added_by_user_id)
      VALUES
        ${queryValues}
      RETURNING
        added_by_user_id,
        expense_id,
        description,
        amount,
        date_expended_at
  `;

  const bindings = getSqlQueryBindings({
    objects: expenses,
    keys: ['description', 'amount', 'date_expended_at'],
    insertAfterEachSet: [user_id],
  });

  const result = await (transaction || sqlClient).query(query, bindings);

  return expenseSchema.array().parse(result);
}

export async function addLabelsToExpenses(
  relations: { expense_id: number; label_ids: number[] }[],
  transaction?: SqlTransaction
) {
  const numOfAdditions = relations.reduce((acc, { label_ids }) => acc + label_ids.length, 0);

  const queryValues = new Array(numOfAdditions)
    .fill(null)
    .map(() => `( ?, ? )`)
    .join(',\n');

  const query = `
      INSERT INTO expenses_labels
        (expense_id, label_id)
      VALUES
        ${queryValues}
      RETURNING
        expense_id,
        label_id
  `;

  const bindings = relations.reduce((bindings, { expense_id, label_ids }) => {
    return [...bindings, ...label_ids.reduce((acc, label_id) => [...acc, expense_id, label_id], [])];
  }, []);

  return await (transaction || sqlClient).query<{ expense_id: number; label_id: number }>(query, bindings);
}

export type AllowedExpensesFilters = 'added_by_user_id';
export async function selectExpenses(filters: Filter<AllowedExpensesFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM expenses ${whereClauses}`;

  const res = await sqlClient.query(query, bindings);

  return expenseSchema.array().parse(res);
}

export type ExpenseSelectFilterNames = 'ex.added_by_user_id' | 'ex.amount' | 'ex_lb.label_id' | 'ex.date_expended_at';

export type ExpenseSelectFilters = Array<Filter<ExpenseSelectFilterNames>>;

export type ExpenseSelectOrder = OrderBy<['ex.amount', 'ex.expense_id']>;

interface ExpenseSelectSqlOptions {
  filters: ExpenseSelectFilters;
  limit?: number;
  order?: ExpenseSelectOrder;
}
export async function selectExpensesWithLabels({ filters, limit, order }: ExpenseSelectSqlOptions) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const limitClause = composeLimitClause(limit);

  const orders: Array<ExpenseSelectOrder> = [
    {
      column: 'ex.expense_id',
      direction: 'DESC',
    },
  ];

  if (order) {
    orders.unshift(order);
  }

  const orderByClause = composeOrderByClause(orders);

  const query = `SELECT
      ex.expense_id,
      ex.description,
      ex.added_by_user_id,
      amount,
      date_expended_at,
      COALESCE(
        json_agg(
          json_build_object(
            'label_id', lb.label_id,
            'name', lb.name,
            'description', lb.description,
            'added_by_user_id', lb.added_by_user_id
          ) ORDER BY lb.label_id
        ) FILTER (WHERE lb.label_id IS NOT NULL),
        '[]'::json
      ) as labels
    FROM expenses ex
    LEFT JOIN expenses_labels ex_lb
      ON ex.expense_id = ex_lb.expense_id
    LEFT JOIN labels lb
      ON ex_lb.label_id = lb.label_id
    ${whereClauses}
    GROUP BY
      ex.expense_id,
      ex.description,
      ex.added_by_user_id,
      amount,
      date_expended_at
    ${orderByClause}
    ${limitClause}
    `;

  const res = await sqlClient.query(query, bindings);

  return z.array(expenseSchema.extend({ labels: z.array(labelSchema) })).parse(res);
}

export type ExpenseDeleteFilterNames = 'ex.added_by_user_id' | 'ex.expense_id';

export type ExpenseDeleteFilters = Array<Filter<ExpenseDeleteFilterNames>>;

interface ExpenseDeleteSqlOptions {
  filters: ExpenseDeleteFilters;
}

export async function deleteExpenses({ filters }: ExpenseDeleteSqlOptions) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `DELETE FROM expenses ex
  ${whereClauses}
  RETURNING *`;

  const res = await sqlClient.query(query, bindings);

  return expenseSchema.array().parse(res);
}
