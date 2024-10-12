import { protectedProcedure, t } from '@src/trpc';
import { labelCreateSchema } from '@src/models/label.models';
import { AllowedLabelsFilters, createLabels, selectLabels } from '@src/db/sql/labels.sql';
import { Filter, FILTER_TYPE } from '@src/db/db.utils';

export const labelsRouter = t.router({
  create: protectedProcedure.input(labelCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;

    const result = createLabels(opts.input, user.user_id);

    return result;
  }),

  getAll: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const filters: Filter<AllowedLabelsFilters>[] = [
      {
        name: 'added_by_user_id',
        type: FILTER_TYPE.Is,
        value: user.user_id,
      },
    ];

    const result = await selectLabels(filters);

    return result;
  }),
});
