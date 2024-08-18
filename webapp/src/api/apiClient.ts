import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../../api/src/trpcAppRouter';

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      async headers() {
        return {
          authorization: getAuthToken(),
        };
      },
    }),
  ],
});

function getAuthToken() {
  return localStorage.getItem('authToken') ?? '';
}
