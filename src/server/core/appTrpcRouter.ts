import { router } from './trpc';
import baseRouter from '../mods/base/api';

export const appTrpcRouter = router({
  base: baseRouter,
});

// export type definition of API
export type AppTrpcRouter = typeof appTrpcRouter;
