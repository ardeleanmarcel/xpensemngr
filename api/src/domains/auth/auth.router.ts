import { z } from 'zod';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';

import { t } from '../../trpc.ts';
import { selectUsers } from '../../domains/users/users.sql.ts';
import { HTTP_ERR } from '../../services/error/http.errors.ts';
import { FILTER_COMPARATOR } from '../../services/database/database.utils.ts';
import { throwHttpError } from '../../services/error/error.utils.ts';
import { selectUserActivations, updateUserActivations } from './user_activations.sql.ts';

const { pick } = lodash;

export const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
});

export const authRouter = t.router({
  signIn: t.procedure.input(signInSchema).mutation(async (opts) => {
    const { username, password } = opts.input;

    const users = await selectUsers([
      { name: 'username', type: FILTER_COMPARATOR.In, value: [username] },
      { name: 'user_status_id', type: FILTER_COMPARATOR.Is, value: 10 },
    ]);

    if (users.length === 0) {
      throwHttpError(HTTP_ERR.e400.BadCredentials);
    }

    const user = users[0];

    const isAllowed = await compare(password, user.password);

    if (!isAllowed) {
      throwHttpError(HTTP_ERR.e400.BadCredentials);
    }

    const payload = { ...pick(user, ['user_id', 'username', 'email']) };
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) throw new Error('Missing AUTH_JWT_SECRET environment variable!');

    // TODO (Valle) -> study algorithms and make an informed selection for the token. HS256 is the default
    // TODO (Valle) -> implement refresh token and reduce expiration time
    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '12h' });

    return { token };
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
});
