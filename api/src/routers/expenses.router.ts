import { protectedProcedure, t } from '@src/trpc';
import { expenseCreateSchema } from '@src/models/expense.models';
import { createExpenses } from '@src/db/sql/expenses.sql';

export const expensesRouter = t.router({
  create: protectedProcedure.input(expenseCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;

    const result = createExpenses(opts.input, user.user_id);

    return result;
  }),
});
