import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';

import { createContext } from './trpcFastifyContext';
import { appRouter, AppRouter } from './trpcAppRouter';
import { ENV_VARS } from './utils/env.utils';
import { XPM_ENV } from './constants/env.const';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

server.addHook('onRequest', async (request, reply) => {
  console.log(`[tRPC Request] ${request.method} ${request.url}`);
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    responseMeta: () => {
      console.log('valle');
      return {};
    },
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
    console.log('Starting server on env: ', ENV_VARS.XPM_ENV);

    if (ENV_VARS.XPM_ENV === XPM_ENV.development) {
      await server.register(cors, { origin: '*', maxAge: 36000 });
    } else {
      const origin = Array.from(new Set(['http://localhost:5173', ENV_VARS.MYE_WEB_UI_ROOT_URL]));
      await server.register(cors, { origin, maxAge: 36000 });
    }

    if (ENV_VARS.XPM_ENV === XPM_ENV.production) {
      // TODO (Valle) -> make it listen to 443 as well (redirect 80 to 443?)
      await server.listen({ port: 80, host: '0.0.0.0' });
      console.log('Listening on port 80');
    }

    if (ENV_VARS.XPM_ENV === XPM_ENV.development) {
      await server.listen({ port: 3000, host: '0.0.0.0' });
      console.log('Listening on port 3000');
    }
  } catch (err) {
    server.log.error(err);
    console.error('Error starting server:', err);
    process.exit(1);
  }
})();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // You can also exit the process here if you want
  // process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  // You can also exit the process here if you want
  // process.exit(1);
});
