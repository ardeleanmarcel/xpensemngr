import { z } from 'zod';

export const labelSchema = z
  .object({
    label_id: z.number().int().positive(),
    name: z.string().min(3).max(20),
    description: z.string().min(3).max(50).optional(),
    added_by_user_id: z.string().date(),
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
