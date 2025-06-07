import { z } from 'zod';
import { labelSchema } from '../../models/business.models.ts';

export const labelCreateSchema = z.array(
  labelSchema
    .pick({
      name: true,
      description: true,
    })
    .strict()
);

export type LabelCreateType = z.infer<typeof labelCreateSchema>;
