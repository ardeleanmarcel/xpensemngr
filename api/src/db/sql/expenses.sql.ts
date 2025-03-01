import { sqlClient } from '@src/adapters/sqlClient.ts';
import { ExpenseCreateType, ExpenseType } from '@src/models/expense.models.ts';
import { Filter } from '../db.utils.ts';
import { composeLimitClause, composeOrderByClause, composeWhereClause } from './utils/sql.utils.ts';
import { LabelType } from '@src/models/label.models.ts';
import { OrderBy } from './types/sql.types.ts';

// TODO (Valle) -> this is highly inefficient, because we are doing a lot of write operations
//  should be a fun challenge to improve
export function createExpensesWithLabels(expenses: ExpenseCreateType, user_id: number) {
  return Promise.all(
    expenses.map(async (expense) => {
      const newExp = await createExpenses([expense], user_id);

      if (expense.label_ids.length > 0) {
        await addLabelsToExpenses([{ expense_id: newExp[0].expense_id, label_ids: expense.label_ids }]);
      }

      return newExp[0].expense_id;
    })
  );
}

export async function createExpenses(expenses: ExpenseCreateType, user_id: number) {
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
        expense_id,
        description,
        amount,
        date_expended_at
  `;

  // TODO (Valle) -> this is not very DRY. can it be made so?
  const bindings = expenses.reduce((bindings, expense) => {
    const { description, amount, date_expended_at } = expense;
    return [...bindings, description, amount, date_expended_at, user_id];
  }, []);

  return await sqlClient.query<ExpenseType>(query, bindings);
}

export async function addLabelsToExpenses(relations: { expense_id: number; label_ids: number[] }[]) {
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

  return await sqlClient.query<{ expense_id: number; label_id: number }>(query, bindings);
}

export type AllowedExpensesFilters = 'added_by_user_id';
export async function selectExpenses(filters: Filter<AllowedExpensesFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM expenses ${whereClauses}`;

  const res = await sqlClient.query<ExpenseType>(query, bindings);

  return res;
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
      amount,
      date_expended_at,
      COALESCE(
        json_agg(
          json_build_object(
            'label_id', lb.label_id,
            'name', lb.name,
            'description', lb.description
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
      amount,
      date_expended_at
    ${orderByClause}
    ${limitClause}
    `;

  const res = await sqlClient.query<ExpenseType & { labels: Omit<LabelType, 'added_by_user_id'>[] }>(query, bindings);

  return res;
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

  const res = await sqlClient.query<ExpenseType>(query, bindings);

  return res;
}
