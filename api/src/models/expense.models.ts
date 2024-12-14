import { z } from 'zod';
import { amountSchema, dbIdSchema } from './utils';

// TODO (Valle) -> add "added_by_user_id"
export const expenseSchema = z
  .object({
    expense_id: z.number().int().positive(),
    description: z.string().min(3).max(50),
    amount: amountSchema,
    date_expended_at: z.string().date(),
  })
  .strict();

export const expenseCreateSchema = z.array(
  expenseSchema
    .pick({
      description: true,
      amount: true,
      date_expended_at: true,
    })
    .extend({
      label_ids: z.array(dbIdSchema),
    })
    .strict()
);

export const expensesGetAllFilterSchema = z.object({
  label_ids: z.array(dbIdSchema).min(1).optional(),
  amount_gte: amountSchema.optional(),
  amount_lte: amountSchema.optional(),
});

export type ExpenseType = z.infer<typeof expenseSchema>;
export type ExpenseCreateType = z.infer<typeof expenseCreateSchema>;
export type ExpensesGetAllFilterType = z.infer<typeof expensesGetAllFilterSchema>;
