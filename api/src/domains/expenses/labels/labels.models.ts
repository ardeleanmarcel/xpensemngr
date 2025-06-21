import { z } from 'zod';
import { labelSchema } from '../../../models/business.models.ts';

export const labelCreateSchema = z.array(
  labelSchema
    .pick({
      name: true,
      description: true,
    })
    .strict()
);

export const labelUpdateSchema = z.array(
  labelSchema.pick({
    label_id: true,
    name: true,
    description: true,
  })
);

export type LabelCreateType = z.infer<typeof labelCreateSchema>;
export type LabelUpdateType = z.infer<typeof labelUpdateSchema>;
