import { TRPCError } from '@trpc/server';
import { HttpError, HttpErrorArgs } from './HttpError.class';

export const TRPC_ERR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;

export function getTRPCErrorCodeFromHTTPStatus(httpStatusCode: number) {
  switch (httpStatusCode) {
    case 400:
      return TRPC_ERR_CODE.BAD_REQUEST;

    case 401:
      return TRPC_ERR_CODE.UNAUTHORIZED;

    case 404:
      return TRPC_ERR_CODE.NOT_FOUND;

    case 500:
      return TRPC_ERR_CODE.INTERNAL_SERVER_ERROR;

    default:
      throw new Error(`Unknown HTTP status code: ${httpStatusCode}`);
  }
}

export function throwHttpError(cfg: HttpErrorArgs): never {
  throw new TRPCError({
    code: getTRPCErrorCodeFromHTTPStatus(cfg.httpCode),
    cause: new HttpError(cfg),
  });
}

// TODO (Valle) -> create a "format zod error" function and use it in env.utils.ts (maybe also at trpc response formatter)
