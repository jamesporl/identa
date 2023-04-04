import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { RoleKey } from '../mods/base/db/_types';
import getAccountFromJwt, { AccountContext } from '../mods/base/utils/getAccountFromJwt';

export const createContext = ({ req }: CreateExpressContextOptions): AccountContext => {
  if (req.headers.authorization) {
    const context = getAccountFromJwt(req.headers.authorization);
    return context;
  }
  return { accountId: '', roleKey: RoleKey.user, perms: [] };
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const { router } = t;
export const middleware = t.middleware; // eslint-disable-line prefer-destructuring
export const publicProcedure = t.procedure;

const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.accountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});

export const authenticatedProcedure = publicProcedure.use(isAuthenticated);
