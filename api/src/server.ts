import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';

import { createContext } from './trpcFastifyContext';
import { appRouter, AppRouter } from './trpcAppRouter';

// TODO (Valle) -> register and export env vars here

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

(async () => {
  try {
    console.log('starting server on port 3000');
    await server.register(cors, { origin: 'http://localhost:5173' });

    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
