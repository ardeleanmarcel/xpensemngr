import { z } from 'zod';

import { FILTER_COMPARATOR } from '@src/db/db.utils';

const queryInputSchema = z.array(
  z
    .object({
      name: z.string(),
      type: z.enum([FILTER_COMPARATOR.In, FILTER_COMPARATOR.Is]),
      value: z.union([z.string(), z.number(), z.array(z.number()), z.array(z.string())]),
    })
    .strict()
);

type FilterSchemaConfig = {
  [x: string]: 'string' | 'number';
};

export function createInputSchema(cfg: FilterSchemaConfig) {
  const filterNames = Object.keys(cfg);

  return queryInputSchema.refine(
    (data) =>
      data.every((f) => {
        if (!filterNames.includes(f.name)) return false;

        const filterType = cfg[f.name];

        if (f.type === FILTER_COMPARATOR.In) {
          return Array.isArray(f.value) && f.value.every((val) => typeof val === filterType);
        }

        return typeof f.value === filterType;
      }),
    { message: 'Input does not resepect filter schema!' }
  );
}
