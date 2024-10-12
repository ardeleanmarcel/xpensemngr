import { sqlClient } from '@src/adapters/sqlClient';
import { ExpenseCreateType, ExpenseType } from '@src/models/expense.models';
import { Filter } from '../db.utils';
import { composeWhereClause } from './utils/sql.utils';

// TODO (Valle) -> this is highly inefficient, because we are doing a lot of write operations
//  should be a fun challenge to improve
export function createLabelsWithExpenses(expenses: ExpenseCreateType, user_id: number) {
  return Promise.all(
    expenses.map(async (expense) => {
      const newExp = await createExpenses([expense], user_id);
      await addLabelsToExpenses([{ expense_id: newExp[0].expense_id, label_ids: expense.label_ids }]);

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

  return await sqlClient.queryWithParams<ExpenseType>(query, bindings);
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

  return await sqlClient.queryWithParams<{ expense_id: number; label_id: number }>(query, bindings);
}

export type AllowedExpensesFilters = 'added_by_user_id';
export async function selectExpenses(filters: Filter<AllowedExpensesFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM expenses ${whereClauses}`;

  const res = await sqlClient.queryWithParams<ExpenseType>(query, bindings);

  return res;
}
