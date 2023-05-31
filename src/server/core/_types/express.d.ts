import { AccountContext } from 'server/mods/base/utils/getAccountFromJwt';

declare global {
  namespace Express {
    export interface Request {
      ctx?: AccountContext;
    }
  }
}
