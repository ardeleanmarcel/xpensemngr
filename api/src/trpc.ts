import { initTRPC } from '@trpc/server';
import { z, ZodError } from 'zod';
import { fromError } from 'zod-validation-error';

import jwt from 'jsonwebtoken';

import { Context } from './trpcFastifyContext';

import { HTTP_ERR, HttpError } from './errors';

export const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { shape, error } = opts;

    if (error.cause instanceof HttpError) {
      return {
        message: error.cause.message,
        data: {
          httpStatus: error.cause.httpCode,
          errorCode: error.cause.errorCode,
        },
      };
    }

    if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
      const reasons = fromError(error.cause).toString();

      return {
        message: HTTP_ERR.e500.ParsingError.message(reasons),
        data: {
          httpStatus: HTTP_ERR.e500.ParsingError.httpCode,
          errorCode: HTTP_ERR.e500.ParsingError.errorCode,
        },
      };
    }

    return {
      message: shape.message,
      data: {
        httpStatus: shape.data.httpStatus,
        errorCode: 500_999,
      },
    };
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
    throw new HttpError(HTTP_ERR.e401.Unauthorized);
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
    throw new HttpError(HTTP_ERR.e401.Unauthorized);
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
