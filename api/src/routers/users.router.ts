import { z } from 'zod';
import { hash, compare } from 'bcrypt';
import lodash from 'lodash';

import { protectedProcedure, t } from '@src/trpc.ts';
import { DEFAULT_SALT_ROUNDS } from '@constants/auth.const.ts';
import { userCreateSchema } from '@models/user.models.ts';
import {
  createUsers,
  hardDeleteAccount,
  selectUsers,
  softDeleteAccount,
  updateUserEmail,
  updateUserPassword,
} from '@sql/users.sql.ts';
import { createUserActivations, selectUserActivations, updateUserActivations } from '@sql/user_activations.sql.ts';

import { createInputSchema } from './utils/router.utils.ts';
import { Filter, FILTER_COMPARATOR } from '@src/db/db.utils.ts';
import { notificationService } from '@src/adapters/service.notification.ts';
import { HTTP_ERR } from '@errors';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { email, password } from '@src/models/common.models.ts';

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
        currentPassword: password,
        newPassword: password,
      })
    )
    .mutation(async (opts) => {
      const { currentPassword, newPassword } = opts.input;
      const {
        ctx: { user: userContext },
      } = opts;

      const userId = userContext.user_id;

      const filters: Filter<'user_id'>[] = [
        {
          name: 'user_id',
          type: FILTER_COMPARATOR.Is,
          value: userId,
        },
      ];

      const users = await selectUsers(filters);
      if (users.length === 0) {
        throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
      }

      const user = users[0];

      const isMatch = await compare(currentPassword, user.password);
      if (!isMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      const hashedNewPassword = await hash(newPassword, DEFAULT_SALT_ROUNDS);

      await updateUserPassword(userId, hashedNewPassword);

      return { success: true };
    }),

  changeEmail: protectedProcedure
    .input(
      z
        .object({
          currentEmail: email,
          newEmail: email,
          password: password,
        })
        .refine((data) => data.newEmail !== data.currentEmail, {
          message: 'New email must be different from current email',
          path: ['newEmail'],
        })
    )
    .mutation(async (opts) => {
      const { currentEmail, newEmail, password } = opts.input;
      const {
        ctx: { user: userContext },
      } = opts;

      const userId = userContext.user_id;

      const filters: Filter<'user_id'>[] = [
        {
          name: 'user_id',
          type: FILTER_COMPARATOR.Is,
          value: userId,
        },
      ];

      const users = await selectUsers(filters);
      if (users.length === 0) {
        throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
      }

      const user = users[0];

      const isPasswordMatch = await compare(password, user.password);
      if (!isPasswordMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      const isEmailMatch = currentEmail === user.email;
      if (!isEmailMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      await updateUserEmail(userId, newEmail);
      return { success: true };
    }),

  softDelete: protectedProcedure
    .input(
      z.object({
        password: password,
      })
    )
    .mutation(async (opts) => {
      const { password } = opts.input;
      const {
        ctx: { user: userContext },
      } = opts;

      const userId = userContext.user_id;

      const filters: Filter<'user_id'>[] = [
        {
          name: 'user_id',
          type: FILTER_COMPARATOR.Is,
          value: userId,
        },
      ];

      const users = await selectUsers(filters);
      console.log('🚀 ~ .mutation ~ users:', users);
      if (users.length === 0) {
        throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
      }

      const user = users[0];
      console.log('🚀 ~ .mutation ~ user:', user);

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      await softDeleteAccount(userId);

      return { success: true };
    }),

  hardDelete: protectedProcedure
    .input(
      z.object({
        password: password,
      })
    )
    .mutation(async (opts) => {
      const { password } = opts.input;
      const {
        ctx: { user: userContext },
      } = opts;

      const userId = userContext.user_id;

      const filters: Filter<'user_id'>[] = [
        {
          name: 'user_id',
          type: FILTER_COMPARATOR.Is,
          value: userId,
        },
      ];

      const users = await selectUsers(filters);
      if (users.length === 0) {
        throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
      }

      const user = users[0];

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        throwHttpError(HTTP_ERR.e400.BadCredentials);
      }

      await hardDeleteAccount(userId);

      return { success: true };
    }),
});
