import { z } from 'zod';
import { userSchema } from '../../models/business.models.ts';

export const userCreateSchema = userSchema
  .pick({
    username: true,
    password: true,
    email: true,
  })
  .strict();
export type UserCreateType = z.infer<typeof userCreateSchema>;
