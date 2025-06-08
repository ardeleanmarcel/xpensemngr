import { z } from 'zod';
import { hash, compare } from 'bcrypt';
import lodash from 'lodash';

import { protectedProcedure, t } from '../../trpc.ts';
import { DEFAULT_SALT_ROUNDS } from '../../services/auth/auth.const.ts';
import { userCreateSchema } from './users.models.ts';
import { createInputSchema } from '../../utils/router.utils.ts';

import { throwHttpError } from '../../services/error/error.utils.ts';
import { email, password } from '../../utils/common.models.ts';
import {
  createUsers,
  hardDeleteAccount,
  selectUsers,
  softDeleteAccount,
  updateUserEmail,
  updateUserPassword,
} from './users.sql.ts';
import { HTTP_ERR } from '../../services/error/http.errors.ts';
import { Filter, FILTER_COMPARATOR } from '../../services/database/database.utils.ts';
import { getInterDomainEventBus } from '../../services/event.bus/event.bus.inter.domain.ts';
import { DomainEventNames } from '../../services/event.bus/event.bus.types.ts';

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

    const bus = getInterDomainEventBus();
    bus.emit({
      name: DomainEventNames.UserCreated,
      payload: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
      },
    });

    const data = pick(user, ['user_id', 'username', 'email']);
    return data;
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
