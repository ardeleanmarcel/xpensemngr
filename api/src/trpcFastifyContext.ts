import * as trpcFastify from '@trpc/server/adapters/fastify';

export async function createContext({ req, res }: trpcFastify.CreateFastifyContextOptions) {
  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
