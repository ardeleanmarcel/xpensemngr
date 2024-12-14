import { protectedProcedure, t } from '@src/trpc';
import { expenseCreateSchema, expensesGetAllFilterSchema } from '@src/models/expense.models';
import {
  ExpenseFilters,
  ExpenseOrder,
  createLabelsWithExpenses,
  selectExpensesWithLabels,
} from '@src/db/sql/expenses.sql';
import { FILTER_TYPE } from '@src/db/db.utils';
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
    const { label_ids, amount_gte, amount_lte } = opts.input;

    const filters: ExpenseFilters = [
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

    if (amount_gte) {
      filters.push({
        name: 'ex.amount',
        type: FILTER_TYPE.GreaterOrEqualThan,
        value: amount_gte,
      });
    }

    if (amount_lte) {
      filters.push({
        name: 'ex.amount',
        type: FILTER_TYPE.LessOrEqualThan,
        value: amount_lte,
      });
    }

    const result = await selectExpensesWithLabels({ filters });

    return result;
  }),
  getHighestAmount: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const filters: ExpenseFilters = [
      {
        name: 'ex.added_by_user_id',
        type: FILTER_TYPE.Is,
        value: user.user_id,
      },
    ];

    const order: ExpenseOrder = {
      column: 'ex.amount',
      direction: 'DESC',
    };

    const result = await selectExpensesWithLabels({ filters, order, limit: 1 });

    return result;
  }),
});
