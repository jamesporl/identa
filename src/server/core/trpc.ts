import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CompanyPermKey } from '../mods/base/db/_types';
import getAccountFromJwt, { AccountContext } from '../mods/base/utils/getAccountFromJwt';

export const createContext = ({ req }: CreateExpressContextOptions): AccountContext => {
  if (req.headers.authorization) {
    const context = getAccountFromJwt(req.headers.authorization);
    return context;
  }
  return {};
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const { router } = t;
export const middleware = t.middleware; // eslint-disable-line prefer-destructuring
export const publicProcedure = t.procedure;

const isAuthenticated = middleware(({ ctx, next }) => {
  if (ctx.accountId) {
    const authedCtx = {
      accountId: ctx.accountId,
      isAdmin: ctx.isAdmin,
      ownsCompany: ctx.ownsCompany,
      companyPerms: ctx.companyPerms,
      companyId: ctx.companyId,
      clinicId: ctx.clinicId,
    };
    return next({ ctx: authedCtx });
  }
  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

export const authenticatedProcedure = publicProcedure.use(isAuthenticated);

const isCompanyAdmin = isAuthenticated.unstable_pipe(({ ctx, next }) => {
  if (
    !ctx.isAdmin
    && ctx.companyId
    && ((ctx.companyPerms || []).includes(CompanyPermKey.companyAdmin) || ctx.ownsCompany)
  ) {
    return next({ ctx });
  }
  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

export const companyAdminProcedure = publicProcedure.use(isCompanyAdmin);
