import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';

import { createContext } from './trpcFastifyContext.ts';
import { appRouter, AppRouter } from './trpcAppRouter.ts';
import { ENV_VARS } from './utils/env.utils.ts';
import { XPM_ENV } from './constants/env.const.ts';
import { log } from '@xpm/logging';
import { getInterDomainEventBus } from './services/event.bus/event.bus.inter.domain.ts';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

server.addHook('onRequest', async (request) => {
  log.info(`[tRPC Request] ${request.method} ${request.url}`);
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    responseMeta: () => {
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
    log.info(`Starting server on env: ${ENV_VARS.XPM_ENV}`);

    getInterDomainEventBus().init();

    if (ENV_VARS.XPM_ENV === XPM_ENV.Local) {
      await server.register(cors, { origin: '*', maxAge: 36000 });
    } else {
      const origin = Array.from(new Set(['http://localhost:5173', ENV_VARS.MYE_WEB_UI_ROOT_URL]));
      await server.register(cors, { origin, maxAge: 36000 });
    }

    if (ENV_VARS.XPM_ENV === XPM_ENV.Production) {
      // TODO (Valle) -> make it listen to 443 as well (redirect 80 to 443?)
      await server.listen({ port: 80, host: '0.0.0.0' });
      log.info('Listening on port 80');
    }

    if (ENV_VARS.XPM_ENV === XPM_ENV.Local) {
      await server.listen({ port: 3000, host: '0.0.0.0' });
      log.info('Listening on port 3000');
    }
  } catch (err) {
    server.log.error(err);
    console.error('Error starting server:', err);
    process.exit(1);
  }
})();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
