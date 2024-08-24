import { z } from 'zod';
import { hash } from 'bcrypt';
import lodash from 'lodash';

import { protectedProcedure, t } from '@src/trpc';
import { DEFAULT_SALT_ROUNDS } from '@constants/auth.const';
import { userCreateSchema } from '@models/user.models';
import { createUsers, selectUsers } from '@sql/users.sql';
import { createUserActivations, selectUserActivations, updateUserActivations } from '@sql/user_activations.sql';

import { createInputSchema } from './utils/router.utils';

import { Filter } from '@src/db/db.utils';
import { notificationService } from '@src/adapters/service.notification';
import { HTTP_ERR, HttpError } from '@src/errors';
import { TRPCError } from '@trpc/server';
import { TRPC_ERR_CODE } from '@src/errors/error.utils';

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

    const userActivation = (await selectUserActivations([uuid]))[0];

    if (!userActivation) {
      throw new TRPCError({
        code: TRPC_ERR_CODE.NOT_FOUND,
        cause: new HttpError(HTTP_ERR.e404.NotFound('Activation code', uuid)),
      });
    }

    if (userActivation.is_used) {
      throw new TRPCError({
        code: TRPC_ERR_CODE.BAD_REQUEST,
        cause: new HttpError(HTTP_ERR.e400.ResourceConsumed('Activation code', uuid)),
      });
    }

    if (userActivation.expires_at < new Date()) {
      throw new TRPCError({
        code: TRPC_ERR_CODE.BAD_REQUEST,
        cause: new HttpError(HTTP_ERR.e400.ResourceExpired('Activation code', uuid)),
      });
    }

    await updateUserActivations([userActivation.activation_code]);

    return { success: true };
  }),
});
