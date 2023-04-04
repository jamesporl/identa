import jwt from 'jsonwebtoken';
import { isAfter } from 'date-fns';
import { JWT_SECRET_AUTH } from './generateAuthToken';
import { PermKey, RoleKey } from '../db/_types';
import perms, { PermShortKey } from './constants/perms';

export interface AccountContext {
  accountId: string;
  roleKey: RoleKey;
  perms: PermKey[];
}

export default function getAccountFromJwt(token: string): AccountContext {
  let accountId = '';
  let roleKey = RoleKey.user;
  const ctxPerms: PermKey[] = [];
  try {
    const result = jwt.verify(
      token,
      JWT_SECRET_AUTH,
    ) as { aid: string, exp: number, rol: RoleKey, per: PermShortKey[] };
    if (isAfter(new Date(result.exp * 1000), new Date())) {
      accountId = result.aid;
      roleKey = result.rol;
      result.per.forEach((p) => {
        const permObj = perms.find((p1) => p1.shortKey === p);
        if (permObj?.key) {
          ctxPerms.push(permObj.key);
        }
      });
    }
  } catch (error) {
    // do nothing
  }

  return { accountId, roleKey, perms: ctxPerms };
}
