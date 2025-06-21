import { z } from 'zod';
import { amountSchema, dbIdSchema, email, password } from '../utils/common.models.ts';

// TODO (Valle) -> business models should be moved outside the "api" folder
// so that they can be used across all apps (FE, BE, etc.)
export const labelSchema = z
  .object({
    label_id: dbIdSchema,
    name: z.string().min(3).max(20),
    description: z.string().min(3).max(50).nullable(),
    added_by_user_id: dbIdSchema,
  })
  .strict();

export type LabelType = z.infer<typeof labelSchema>;

export const userSchema = z.object({
  user_id: z.number().int().positive(),
  username: z.string().min(3).max(20),
  password: password,
  email: email,
  user_status_id: z.number().int().positive(),
});

export type UserType = z.infer<typeof userSchema>;

export const expenseSchema = z
  .object({
    added_by_user_id: dbIdSchema,
    expense_id: dbIdSchema,
    description: z.string().min(3).max(50),
    amount: amountSchema,
    date_expended_at: z.string().date(),
  })
  .strict();
