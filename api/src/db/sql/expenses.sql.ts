import { sqlClient } from '@src/adapters/sqlClient';
import { ExpenseCreateType, ExpenseType } from '@src/models/expense.models';
import { Filter } from '../db.utils';
import { composeWhereClause } from './utils/sql.utils';

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

export type AllowedExpensesFilters = 'added_by_user_id';
export async function selectExpenses(filters: Filter<AllowedExpensesFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM expenses ${whereClauses}`;

  const res = await sqlClient.queryWithParams<ExpenseType>(query, bindings);

  return res;
}
