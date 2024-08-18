import { z } from 'zod';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';

import { t } from '@src/trpc';
import { selectUsers } from '@src/db/sql/users.sql';
import { HttpError, HTTP_ERR } from '@src/errors';
import { FILTER_TYPE } from '@src/db/db.utils';

const { pick } = lodash;

export const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
});

export const authRouter = t.router({
  signIn: t.procedure.input(signInSchema).mutation(async (opts) => {
    const { username, password } = opts.input;

    const user = (
      await selectUsers([
        { name: 'username', type: FILTER_TYPE.In, value: [username] },
        { name: 'user_status_id', type: FILTER_TYPE.Is, value: 10 },
      ])
    )[0];

    if (!user) throw new HttpError(HTTP_ERR.e400.BadCredentials);

    const isAllowed = await compare(password, user.password);

    if (!isAllowed) throw new HttpError(HTTP_ERR.e400.BadCredentials);

    const payload = pick(user, ['user_id', 'username', 'email']);
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) throw new Error('Missing AUTH_JWT_SECRET environment variable!');

    // TODO (Valle) -> study algorithms and make an informed selection for the token. HS256 is the default
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

    return { token };
  }),
});
