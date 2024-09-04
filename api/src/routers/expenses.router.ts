import { protectedProcedure, t } from '@src/trpc';
import { expenseCreateSchema } from '@src/models/expense.models';
import { AllowedExpensesFilters, createExpenses, selectExpenses } from '@src/db/sql/expenses.sql';
import { Filter, FILTER_TYPE } from '@src/db/db.utils';

export const expensesRouter = t.router({
  create: protectedProcedure.input(expenseCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;

    const result = createExpenses(opts.input, user.user_id);

    return result;
  }),
  getAll: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const filters: Filter<AllowedExpensesFilters>[] = [
      {
        name: 'added_by_user_id',
        type: FILTER_TYPE.Is,
        value: user.user_id,
      },
    ];

    const result = await selectExpenses(filters);

    return result;
  }),
});
