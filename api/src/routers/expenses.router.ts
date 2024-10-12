import { protectedProcedure, t } from '@src/trpc';
import { expenseCreateSchema } from '@src/models/expense.models';
import { AllowedExpensesFilters, createLabelsWithExpenses, selectExpenses } from '@src/db/sql/expenses.sql';
import { Filter, FILTER_TYPE } from '@src/db/db.utils';
import { checkLabelsBelongToUser } from '@src/db/sql/labels.sql';

export const expensesRouter = t.router({
  create: protectedProcedure.input(expenseCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;
    const newExpenses = opts.input;

    const requestedLabels = newExpenses.reduce((acc, expense) => {
      return [...acc, ...expense.label_ids];
    }, []);

    await checkLabelsBelongToUser(requestedLabels, user.user_id);

    const newExpIds = await createLabelsWithExpenses(newExpenses, user.user_id);

    return newExpIds;
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
