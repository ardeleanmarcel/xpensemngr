import { t } from './trpc.ts';
import { authRouter } from './domains/auth/auth.router.ts';
import { expensesRouter } from './domains/expenses/expenses.router.ts';
import { usersRouter } from './domains/users/users.router.ts';

export const appRouter = t.router({
  users: usersRouter,
  auth: authRouter,
  expenses: expensesRouter,
});

// Here we export the type definition of the API
export type AppRouter = typeof appRouter;
