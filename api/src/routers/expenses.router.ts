import { protectedProcedure, t } from '@src/trpc';
import { expenseCreateSchema, expensesGetAllFilterSchema } from '@src/models/expense.models';
import {
  AllowedExpensesWithLabelsFilters,
  createLabelsWithExpenses,
  selectExpensesWithLabels,
} from '@src/db/sql/expenses.sql';
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
  getAll: protectedProcedure.input(expensesGetAllFilterSchema).query(async (opts) => {
    const { user } = opts.ctx;
    const { label_ids } = opts.input;

    const filters: Filter<AllowedExpensesWithLabelsFilters>[] = [
      {
        name: 'ex.added_by_user_id',
        type: FILTER_TYPE.Is,
        value: user.user_id,
      },
    ];

    if (label_ids) {
      filters.push({
        name: 'ex_lb.label_id',
        type: FILTER_TYPE.In,
        value: label_ids,
      });
    }

    const result = await selectExpensesWithLabels(filters);

    return result;
  }),
});
