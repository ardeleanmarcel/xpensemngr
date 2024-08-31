import { initTRPC } from '@trpc/server';
import { z, ZodError } from 'zod';
import { fromError } from 'zod-validation-error';

import jwt from 'jsonwebtoken';

import { Context } from './trpcFastifyContext';

import { HTTP_ERR, HttpError } from './errors';
import { throwHttpError } from './errors/error.utils';

export const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { shape, error } = opts;
    if (error.cause instanceof HttpError) {
      return {
        code: shape.code,
        message: error.cause.message,
        data: {
          httpStatus: shape.data.httpStatus,
          xpmErrorCode: error.cause.errorCode,
        },
      };
    }

    if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
      const reasons = fromError(error.cause).toString();

      const errData = HTTP_ERR.e400.ParseError(reasons);

      return {
        code: shape.code,
        message: errData.message,
        data: {
          httpStatus: shape.data.httpStatus,
          xpmErrorCode: errData.errorCode,
        },
      };
    }

    return shape;
  },
});

const jwtUserPayloadSchema = z
  .object({
    user_id: z.number(),
    username: z.string(),
    email: z.string(),
    iat: z.number(),
  })
  .strict();

type JwtUserPayload = z.infer<typeof jwtUserPayloadSchema>;

// TODO (Valle) -> could get permissions from DB if necessary?!?!
// maybe add another middleware for this? maybe have a permissionsProcedure?
// TODO (Valle) -> add expiration to token and include this in the verification process!
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  const authHeader = ctx.req.headers.authorization;

  if (!authHeader) {
    throwHttpError(HTTP_ERR.e401.Unauthorized);
  }

  let user: JwtUserPayload;
  try {
    // TODO (Valle) -> create function that returns env and replace everywhere.
    // run at server creation and export from there?
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) throw new Error('Missing AUTH_JWT_SECRET environment variable!');

    const data: unknown = jwt.verify(authHeader.split(' ')[1], secret);

    user = jwtUserPayloadSchema.parse(data);
  } catch (e) {
    // TODO (Valle) -> find better way to log this error
    console.error(e);
    throwHttpError(HTTP_ERR.e401.Unauthorized);
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
