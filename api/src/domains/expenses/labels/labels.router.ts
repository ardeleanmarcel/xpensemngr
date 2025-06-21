import { protectedProcedure, t } from '../../../trpc.ts';
import { labelCreateSchema, labelUpdateSchema } from './labels.models.ts';
import {
  AllowedLabelsFilters,
  checkLabelsBelongToUser,
  createLabels,
  selectLabels,
  updateLabels,
} from './labels.sql.ts';
import { Filter, FILTER_COMPARATOR } from '../../../services/database/database.utils.ts';
import { throwHttpError } from '../../../services/error/error.utils.ts';
import { HTTP_ERR } from '../../../services/error/http.errors.ts';

export const labelsRouter = t.router({
  create: protectedProcedure.input(labelCreateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;

    const result = createLabels(opts.input, user.user_id);

    return result;
  }),

  // TODO (Valle) -> allow for partial updates
  update: protectedProcedure.input(labelUpdateSchema).mutation(async (opts) => {
    const { user } = opts.ctx;
    const { input: labels } = opts;

    const allLablesBelongToUser = await checkLabelsBelongToUser(
      labels.map((label) => label.label_id),
      user.user_id
    );

    if (!allLablesBelongToUser) {
      throwHttpError(HTTP_ERR.e400.BadRequest(`User does not have access to requested label(s).`));
    }

    const result = await updateLabels(labels);

    return result;
  }),

  getAll: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const filters: Filter<AllowedLabelsFilters>[] = [
      {
        name: 'added_by_user_id',
        type: FILTER_COMPARATOR.Is,
        value: user.user_id,
      },
    ];

    const result = await selectLabels(filters);

    return result;
  }),
});
