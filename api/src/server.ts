// import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
// import fastify from 'fastify';
// import cors from '@fastify/cors';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';

// import { createContext } from './trpcFastifyContext';
import { createContext } from './trpc';
import { appRouter, AppRouter } from './trpcAppRouter';
import { ENV_VARS } from './utils/env.utils';
import { XPM_ENV } from './constants/env.const';

// ----------------------------------------------- expres expirement below ------------------------------------------------
// created for each request
// const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res }); // no context

const app = express();

const origin = Array.from(new Set(['http://localhost:5173', ENV_VARS.MYE_WEB_UI_ROOT_URL]));
console.log('origin: ', origin);

app.use(
  cors({
    origin,
  })
);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = ENV_VARS.XPM_ENV === XPM_ENV.production ? 80 : 3000;
console.log('Starting server on env: ', ENV_VARS.XPM_ENV);

app.listen(port);
console.log(`Server listening on port ${port}`);
// ----------------------------------------------- expres expirement below ------------------------------------------------

// const server = fastify({
//   maxParamLength: 5000,
// });

// server.register(fastifyTRPCPlugin, {
//   prefix: '/trpc',
//   trpcOptions: {
//     router: appRouter,
//     createContext,
//     onError({ path, error }) {
//       // report to error monitoring
//       console.error(`Error in tRPC handler on path '${path}':`, error);
//     },
//   } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
// });

// (async () => {
//   try {
//     console.log('Starting server on env: ', ENV_VARS.XPM_ENV);

//     const origin = Array.from(new Set(['http://localhost:5173', ENV_VARS.MYE_WEB_UI_ROOT_URL]));
//     await server.register(cors, { origin, maxAge: 36000 });

//     if (ENV_VARS.XPM_ENV === XPM_ENV.production) {
//       // TODO (Valle) -> make it listen to 443 as well (redirect 80 to 443?)
//       await server.listen({ port: 80, host: '0.0.0.0' });
//       console.log('Listening on port 80');
//     }

//     if (ENV_VARS.XPM_ENV === XPM_ENV.development) {
//       await server.listen({ port: 3000, host: '0.0.0.0' });
//       console.log('Listening on port 3000');
//     }
//   } catch (err) {
//     server.log.error(err);
//     console.error('Error starting server:', err);
//     process.exit(1);
//   }
// })();

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
