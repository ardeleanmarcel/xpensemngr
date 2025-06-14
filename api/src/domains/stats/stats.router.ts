import { protectedProcedure, t } from '../../trpc.ts';

import { selectExpensesLastTwoWeeks as selectDailyExpensesLastTwoWeeks } from './stats.sql.ts';

export const statsRouter = t.router({
  expensesByTime: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const result = await selectDailyExpensesLastTwoWeeks({ user_id: user.user_id });

    const expenseToDateMap = mapExpensesToDates(result);

    const data = Object.entries(expenseToDateMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    return data;
  }),
});

function mapExpensesToDates(expenses: { date_expended_at: string; amount: number }[]): Record<string, number> {
  const last14Days = generateMapLast14Days();

  const expensesByDate = expenses.reduce<Record<string, number>>((acc, val) => {
    const date = new Date(val.date_expended_at).toISOString().split('T')[0];

    if (!(date in acc)) {
      return acc;
    }

    acc[date] += val.amount;

    return acc;
  }, last14Days);

  return expensesByDate;
}

function generateMapLast14Days(): Record<string, number> {
  const currDate = new Date();
  const map: Record<string, number> = {};

  for (let i = 0; i < 14; i++) {
    const dateString = currDate.toISOString().split('T')[0];
    map[dateString] = 0;
    currDate.setDate(currDate.getDate() - 1);
  }

  return map;
}
