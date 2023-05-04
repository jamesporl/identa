import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { isAfter } from 'date-fns';
import { PermKey, RoleKey } from '../db/_types';
import perms, { PermShortKey } from './constants/perms';
import config from '../../../core/config';

export interface AccountContext {
  accountId?: Types.ObjectId;
  roleKey?: RoleKey;
  perms?: PermKey[];
  companyId?: Types.ObjectId;
  clinicId?: Types.ObjectId;
}

export interface DecodedJwt {
  aid: string;
  exp: number;
  rol: RoleKey;
  per: PermShortKey[];
  coi?: string;
  cli?: string;
}

export default function getAccountFromJwt(token: string): AccountContext {
  const {
    aid, exp, rol, per, coi, cli,
  } = jwt.verify(
    token,
    config.JWT_AUTH_SECRET,
  ) as DecodedJwt;

  if (!isAfter(new Date(exp * 1000), new Date())) {
    throw new Error('Token is expired');
  }

  const ctxPerms: PermKey[] = [];
  per.forEach((p) => {
    const permObj = perms.find((p1) => p1.shortKey === p);
    if (permObj?.key) {
      ctxPerms.push(permObj.key);
    }
  });

  let companyId: Types.ObjectId | undefined;
  if (coi) {
    companyId = new Types.ObjectId(coi);
  }
  let clinicId: Types.ObjectId | undefined;
  if (cli) {
    clinicId = new Types.ObjectId(cli);
  }

  return {
    accountId: new Types.ObjectId(aid),
    roleKey: rol,
    perms: ctxPerms,
    companyId,
    clinicId,
  };
}
