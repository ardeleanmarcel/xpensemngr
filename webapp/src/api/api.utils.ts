import { TRPCClientError } from '@trpc/client';

export function getXpmErrCode(apiError: unknown): number | null {
  if (apiError instanceof TRPCClientError) {
    return (apiError.data?.xpmErrorCode as number) ?? null;
  }

  return null;
}
