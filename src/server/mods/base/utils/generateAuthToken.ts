import jwt from 'jsonwebtoken';
import { Account, RoleKey } from '../db/_types';
import perms, { PermShortKey } from './constants/perms';

export const JWT_SECRET_AUTH = process.env.JWT_SECRET_AUTH || 'cHangeM3Ok!';

export default function generateAuthToken(account:Account, roleKey?: RoleKey) {
  let roleKeyToSign: RoleKey | undefined;
  const permsToSign: PermShortKey[] = [];
  if (account.roles.length) {
    let role = account.roles[0];
    if (roleKey) {
      const existingRole = account.roles.find((r) => r.roleKey === roleKey);
      if (existingRole?.roleKey) {
        role = existingRole;
      }
    }
    roleKeyToSign = role.roleKey;
    (role.perms || []).forEach((p) => {
      const permObj = perms.find((p1) => p1.key === p);
      if (permObj?.shortKey) {
        permsToSign.push(permObj.shortKey);
      }
    });
  }

  if (!roleKeyToSign) {
    throw new Error('There is no assigned role to the account');
  }

  const objToSign = { aid: account._id.toHexString(), rol: roleKeyToSign, per: permsToSign };

  return jwt.sign(objToSign, JWT_SECRET_AUTH, { expiresIn: '30d' });
}
