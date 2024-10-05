import { z } from 'zod';
import { hash, compare } from 'bcrypt';
import lodash from 'lodash';

import { protectedProcedure, t } from '@src/trpc';
import { DEFAULT_SALT_ROUNDS } from '@constants/auth.const';
import { userCreateSchema } from '@models/user.models';
import { createUsers, selectUsers, updateUserPassword } from '@sql/users.sql';
import { createUserActivations, selectUserActivations, updateUserActivations } from '@sql/user_activations.sql';

import { createInputSchema } from './utils/router.utils';
import { Filter, FILTER_TYPE } from '@src/db/db.utils';
import { notificationService } from '@src/adapters/service.notification';
import { HTTP_ERR } from '@src/errors';
import { throwHttpError } from '@src/errors/error.utils';

const { pick } = lodash;

const USER_FILTERS = { username: 'string' } as const;
type UserFilterNames = keyof typeof USER_FILTERS;

const getUsersInputSchema = createInputSchema(USER_FILTERS);

export const usersRouter = t.router({
  // TODO (Valle) -> this route should not be accessible to "anyone" (meaning admins only)
  get: protectedProcedure.input(getUsersInputSchema).query(async (opts) => {
    const r = await selectUsers(opts.input as Filter<UserFilterNames>[]);
    return r;
  }),

  create: t.procedure.input(userCreateSchema).mutation(async (opts) => {
    const { username, password, email } = opts.input;
    const {
      ctx: { res },
    } = opts;

    // TODO (Valle) -> setting status like this doesn't work. find another way
    res.status(202);

    const hashedPassword = await hash(password, DEFAULT_SALT_ROUNDS);
    const user = (await createUsers([{ username, password: hashedPassword, email }]))[0];

    const activation = (await createUserActivations([user.user_id]))[0];

    const confirmationUrl = `${process.env.MYE_WEB_UI_ROOT_URL}/verify-email?activationCode=${activation.activation_code}`;

    await notificationService.sendAccountConfirmationEmail({
      email,
      confirmationUrl,
      username,
    });

    const data = pick(user, ['user_id', 'username', 'email']);
    return data;
  }),

  activate: t.procedure.input(z.string().uuid()).query(async (opts) => {
    const uuid = opts.input;

    const userActivations = await selectUserActivations([uuid]);

    if (userActivations.length === 0) {
      throwHttpError(HTTP_ERR.e404.NotFound('Activation code', uuid));
    }

    const userActivation = userActivations[0];

    if (userActivation.is_used) {
      throwHttpError(HTTP_ERR.e400.ResourceConsumed('Activation code', uuid));
    }

    if (userActivation.expires_at < new Date()) {
      throwHttpError(HTTP_ERR.e400.ResourceExpired('Activation code', uuid));
    }

    await updateUserActivations([userActivation.activation_code]);

    return { success: true };
  }),

  changePassword: protectedProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async (opts) => {
      const { userId, currentPassword, newPassword } = opts.input;
      const {
        ctx: { res },
      } = opts;

      const filters: Filter<'user_id'>[] = [
        {
          name: 'user_id',
          type: FILTER_TYPE.Is,
          value: userId,
        },
      ];

      const users = await selectUsers(filters);
      if (users.length === 0) {
        throwHttpError(HTTP_ERR.e404.NotFound('User', userId));
      }

      const user = users[0];

      const isMatch = await compare(currentPassword, user.password);
      if (!isMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      const hashedNewPassword = await hash(newPassword, DEFAULT_SALT_ROUNDS);

      await updateUserPassword(userId, hashedNewPassword);

      res.status(200);
      return { success: true };
    }),
});
