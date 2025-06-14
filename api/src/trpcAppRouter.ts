import { t } from './trpc.ts';
import { authRouter } from './domains/auth/auth.router.ts';
import { expensesRouter } from './domains/expenses/expenses.router.ts';
import { usersRouter } from './domains/users/users.router.ts';
import { statsRouter } from './domains/stats/stats.router.ts';

export const appRouter = t.router({
  auth: authRouter,
  expenses: expensesRouter,
  stats: statsRouter,
  users: usersRouter,
});

// Here we export the type definition of the API
export type AppRouter = typeof appRouter;
