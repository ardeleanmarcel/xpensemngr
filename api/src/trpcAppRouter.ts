import { t } from '@src/trpc';
import { authRouter, expensesRouter, usersRouter } from '@routers';

export const appRouter = t.router({
  users: usersRouter,
  auth: authRouter,
  expenses: expensesRouter,
});

// Here we export the type definition of the API
export type AppRouter = typeof appRouter;
