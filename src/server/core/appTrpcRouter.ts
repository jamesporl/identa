import { router } from './trpc';
import baseRouter from '../mods/base/api';
import practiceRouter from '../mods/practice/api';

export const appTrpcRouter = router({
  base: baseRouter,
  practice: practiceRouter,
});

// export type definition of API
export type AppTrpcRouter = typeof appTrpcRouter;
