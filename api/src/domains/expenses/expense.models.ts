import { z } from 'zod';
import { amountSchema, dbIdSchema } from '@src/utils/common.models.ts';

export const expenseSchema = z
  .object({
    added_by_user_id: dbIdSchema,
    expense_id: dbIdSchema,
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

export const expenseGetAllSchema = z.object({
  label_ids: z.array(dbIdSchema).min(1).optional(),
  amount_gte: amountSchema.optional(),
  amount_lte: amountSchema.optional(),
  date_gte: z.string().date().optional(),
  date_lte: z.string().date().optional(),
});

export const expenseDeleteSchema = z.array(dbIdSchema);

export type ExpenseType = z.infer<typeof expenseSchema>;
export type ExpenseCreateType = z.infer<typeof expenseCreateSchema>;
export type ExpenseGetAllFilterType = z.infer<typeof expenseGetAllSchema>;
export type ExpenseDeleteType = z.infer<typeof expenseDeleteSchema>;
