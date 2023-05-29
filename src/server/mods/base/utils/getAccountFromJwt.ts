import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { isAfter } from 'date-fns';
import { CompanyPermKey } from '../db/_types';
import perms, { CompanyPermShortKey } from './constants/companyPerms';
import config from '../../../core/config';

export interface AccountContext {
  accountId?: Types.ObjectId;
  isAdmin?: boolean;
  ownsCompany?: boolean;
  companyPerms?: CompanyPermKey[];
  companyId?: Types.ObjectId;
  clinicId?: Types.ObjectId;
}

export interface DecodedJwt {
  aid: string;
  exp: number;
  isa: boolean;
  own?: boolean;
  cpr?: CompanyPermShortKey[];
  coi?: string;
  cli?: string;
}

export default function getAccountFromJwt(token: string): AccountContext {
  const {
    aid, exp, isa, cpr, coi, cli, own,
  } = jwt.verify(
    token,
    config.JWT_AUTH_SECRET,
  ) as DecodedJwt;

  if (!isAfter(new Date(exp * 1000), new Date())) {
    throw new Error('Token is expired');
  }

  const ctxCompanyPerms: CompanyPermKey[] = [];
  if (cpr) {
    cpr.forEach((p) => {
      const permObj = perms.find((p1) => p1.shortKey === p);
      if (permObj?.key) {
        ctxCompanyPerms.push(permObj.key);
      }
    });
  }

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
    isAdmin: isa,
    ownsCompany: !!own,
    companyPerms: ctxCompanyPerms,
    companyId,
    clinicId,
  };
}
