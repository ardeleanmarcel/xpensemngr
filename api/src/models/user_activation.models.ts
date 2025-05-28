import { z } from 'zod';
import { dbIdSchema } from './utils.ts';

export const userActivationSchema = z
  .object({
    user_id: dbIdSchema,
    activation_code: z.string().uuid(),
    expires_at: z.string().datetime(),
    is_used: z.boolean(),
  })
  .strict();

export type UserActivationType = z.infer<typeof userActivationSchema>;

export type UserActivationDbData = Pick<UserActivationType, 'user_id' | 'activation_code' | 'is_used'> & {
  expires_at: Date;
};

export type UserActivationUpdate = Pick<UserActivationType, 'activation_code'>;
