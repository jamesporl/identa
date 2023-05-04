import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { MAccountCompanyClinicLink, MAccountCompanyLink, MClinic } from '../db';
import { Account, RoleKey } from '../db/_types';
import perms, { PermShortKey } from './constants/perms';
import config from '../../../core/config';

export default async function generateAuthToken({
  account, roleKey, companyId, clinicId,
}:{
  account: Account,
  roleKey?: RoleKey,
  companyId?: Types.ObjectId,
  clinicId?: Types.ObjectId,
}) {
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

  let companyIdToSign: Types.ObjectId | undefined;
  let clinicIdToSign: Types.ObjectId | undefined;
  if (roleKeyToSign === RoleKey.user) {
    if (companyId) {
      const companyLinkExists = !!(await MAccountCompanyLink.findOne(
        { 'account._id': account._id, 'company._id': companyId },
      ));
      if (!companyLinkExists) {
        throw new Error('Account is not a member of the company');
      }
      companyIdToSign = companyId;
      if (clinicId) {
        const clinicLinkExists = !!(await MAccountCompanyClinicLink.findOne(
          { 'account._id': account._id, 'clinic._id': clinicId, 'company._id': companyId },
        ));
        if (!clinicLinkExists) {
          throw new Error('Account is not a member of the clinic');
        }
        clinicIdToSign = clinicId;
      } else if (account.lastUsedClinicId) {
        const clinic = await MClinic.findOne({ _id: account.lastUsedClinicId });
        if (clinic && clinic.companyId.toHexString() === companyId.toHexString()) {
          clinicIdToSign = clinic._id;
        }
      }

      if (!clinicIdToSign) {
        const clinicLink = await MAccountCompanyClinicLink.findOne(
          { 'account._id': account._id, 'company._id': companyId },
        );
        if (clinicLink?.clinic) {
          clinicIdToSign = clinicLink?.clinic._id;
        }
      }
    } else {
      companyIdToSign = account.lastUsedCompanyId;
      clinicIdToSign = account.lastUsedClinicId;
    }
  }

  const objToSign = {
    aid: account._id.toHexString(),
    rol: roleKeyToSign,
    per: permsToSign,
    coi: companyIdToSign ? companyIdToSign.toHexString() : undefined,
    cli: clinicIdToSign ? clinicIdToSign.toHexString() : undefined,
  };

  return jwt.sign(objToSign, config.JWT_AUTH_SECRET, { expiresIn: '30d' });
}
