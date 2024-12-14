import { z } from 'zod';

// TODO (Valle) -> add "added_by_user_id"
export const expenseSchema = z
  .object({
    expense_id: z.number().int().positive(),
    description: z.string().min(3).max(50),
    amount: z
      .number()
      .positive()
      .lt(1_000_000_000_000)
      .refine((num) => {
        const asString = String(num);
        const decimals = asString.split('.')[1];
        return !decimals || decimals.length < 3;
      }, 'amount should be a number with maximum 2 decimals'),
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
      label_ids: z.array(z.number().int().positive()),
    })
    .strict()
);

export const expensesGetAllFilterSchema = z.object({
  label_ids: z.array(z.number().int().positive()).min(1).optional(),
});

export type ExpenseType = z.infer<typeof expenseSchema>;
export type ExpenseCreateType = z.infer<typeof expenseCreateSchema>;
export type ExpensesGetAllFilterType = z.infer<typeof expensesGetAllFilterSchema>;
