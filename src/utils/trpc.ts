import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AUTH_TOKEN_KEY } from 'client/core/utils/storageKeys';
import type { AppTrpcRouter } from '../server/core/appTrpcRouter';

const trpcBaseUrl = `http://localhost:${process.env.PORT ?? 3000}`;

export type RouterInput = inferRouterInputs<AppTrpcRouter>;
export type RouterOutput = inferRouterOutputs<AppTrpcRouter>;

export default createTRPCNext<AppTrpcRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${trpcBaseUrl}/trpc`,
          async headers() {
            let authToken = '';
            if (typeof window !== 'undefined') {
              authToken = localStorage.getItem(AUTH_TOKEN_KEY) || '';
            }
            return {
              authorization: authToken,
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});
