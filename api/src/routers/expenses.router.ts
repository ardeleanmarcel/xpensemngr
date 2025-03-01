import { protectedProcedure, t } from '@src/trpc.ts';
import { expenseCreateSchema, expenseDeleteSchema, expenseGetAllSchema } from '@src/models/expense.models.ts';
import {
  ExpenseSelectFilters,
  ExpenseSelectOrder,
  createExpensesWithLabels,
  deleteExpenses,
  selectExpensesWithLabels,
} from '@src/db/sql/expenses.sql.ts';
import { FILTER_COMPARATOR } from '@src/db/db.utils.ts';
import { checkLabelsBelongToUser } from '@src/db/sql/labels.sql.ts';

export const expensesRouter = t.router({
  create: protectedProcedure.input(expenseCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;
    const newExpenses = opts.input;

    const requestedLabels = newExpenses.reduce((acc, expense) => {
      return [...acc, ...expense.label_ids];
    }, []);

    await checkLabelsBelongToUser(requestedLabels, user.user_id);

    const newExpIds = await createExpensesWithLabels(newExpenses, user.user_id);

    return newExpIds;
  }),
  getAll: protectedProcedure.input(expenseGetAllSchema).query(async (opts) => {
    const { user } = opts.ctx;
    const { label_ids, amount_gte, amount_lte, date_gte, date_lte } = opts.input;

    const filters: ExpenseSelectFilters = [
      {
        name: 'ex.added_by_user_id',
        type: FILTER_COMPARATOR.Is,
        value: user.user_id,
      },
    ];

    if (label_ids) {
      filters.push({
        name: 'ex_lb.label_id',
        type: FILTER_COMPARATOR.In,
        value: label_ids,
      });
    }

    if (amount_gte) {
      filters.push({
        name: 'ex.amount',
        type: FILTER_COMPARATOR.GreaterThanOrEqual,
        value: amount_gte,
      });
    }

    if (amount_lte) {
      filters.push({
        name: 'ex.amount',
        type: FILTER_COMPARATOR.LessThanOrEqual,
        value: amount_lte,
      });
    }

    if (date_gte) {
      filters.push({
        name: 'ex.date_expended_at',
        type: FILTER_COMPARATOR.GreaterThanOrEqual,
        value: date_gte,
      });
    }

    if (date_lte) {
      filters.push({
        name: 'ex.date_expended_at',
        type: FILTER_COMPARATOR.LessThanOrEqual,
        value: date_lte,
      });
    }

    const result = await selectExpensesWithLabels({ filters });

    return result;
  }),
  getHighestAmount: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const filters: ExpenseSelectFilters = [
      {
        name: 'ex.added_by_user_id',
        type: FILTER_COMPARATOR.Is,
        value: user.user_id,
      },
    ];

    const order: ExpenseSelectOrder = {
      column: 'ex.amount',
      direction: 'DESC',
    };

    const result = await selectExpensesWithLabels({ filters, order, limit: 1 });

    return result;
  }),
  delete: protectedProcedure.input(expenseDeleteSchema).mutation(async (opts) => {
    const { user } = opts.ctx;
    const ids = opts.input;

    // TODO (Valle) -> should add check that all the IDs marked for deletion actually belong to the user

    const result = await deleteExpenses({
      filters: [
        {
          name: 'ex.added_by_user_id',
          type: FILTER_COMPARATOR.Is,
          value: user.user_id,
        },
        {
          name: 'ex.expense_id',
          type: FILTER_COMPARATOR.In,
          value: ids,
        },
      ],
    });

    return result;
  }),
});
