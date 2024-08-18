import { z } from 'zod';

export const userSchema = z.object({
  user_id: z.number().int().positive(),
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
  email: z.string().email(),
  user_status_id: z.number().int().positive(),
});

export const userCreateSchema = userSchema
  .pick({
    username: true,
    password: true,
    email: true,
  })
  .strict();

export type UserType = z.infer<typeof userSchema>;
export type UserCreateType = z.infer<typeof userCreateSchema>;
