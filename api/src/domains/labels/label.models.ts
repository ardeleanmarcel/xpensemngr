import { z } from 'zod';
import { dbIdSchema } from '@src/utils/common.models.ts';

export const labelSchema = z
  .object({
    label_id: dbIdSchema,
    name: z.string().min(3).max(20),
    description: z.string().min(3).max(50).optional(),
    added_by_user_id: dbIdSchema,
  })
  .strict();

export const labelCreateSchema = z.array(
  labelSchema
    .pick({
      name: true,
      description: true,
    })
    .strict()
);

export type LabelType = z.infer<typeof labelSchema>;
export type LabelCreateType = z.infer<typeof labelCreateSchema>;
