import { z } from 'zod';
import { sqlClient } from '../../services/database/client.sql.ts';
import { expenseSchema } from '../../models/business.models.ts';

// select the last 15 days because we want to capture the entirety of the day that was two weeks ago
// and we can disregard the oldest day from the result set
export async function selectExpensesLastTwoWeeks({ user_id }: { user_id: number }) {
  const query = `SELECT
    ex.date_expended_at,
    ex.amount
    FROM expenses ex
    WHERE ex.added_by_user_id = ?
      AND ex.date_expended_at >= NOW() - INTERVAL '15 days'
    ORDER BY
      ex.date_expended_at DESC
    `;
  const bindings = [user_id];

  const res = await sqlClient.query(query, bindings);

  return z.array(expenseSchema.pick({ date_expended_at: true, amount: true })).parse(res);
}
