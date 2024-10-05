import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../../api/src/trpcAppRouter';

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_MAIN_API_URL}/trpc`,
      async headers() {
        return {
          authorization: getAuthToken(),
        };
      },
    }),
  ],
});

function getAuthToken() {
  return 'Bearer ' + (localStorage.getItem('authToken') ?? '');
}
