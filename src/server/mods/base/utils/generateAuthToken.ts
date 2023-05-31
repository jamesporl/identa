import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import {
  MAccountCompanyClinicLink, MAccountCompanyLink, MClinic, MCompany,
} from '../db';
import {
  Account, AccountCompanyLink, Company, CompanyPermKey,
} from '../db/_types';
import config from '../../../core/config';
import companyPerms, { CompanyPermShortKey } from './constants/companyPerms';

function computeHasCompanyAdminPerm(
  account: Account,
  company: Company,
  companyLink: AccountCompanyLink,
) {
  // account owns company
  if (company.ownedById.toHexString() === account._id.toHexString()) {
    return true;
  }
  if ((companyLink.perms || []).includes(CompanyPermKey.companyAdmin)) {
    return true;
  }
  return false;
}

async function checkCompanyAndClinicAccess(
  account: Account,
  companyId: Types.ObjectId,
  clinicId?: Types.ObjectId,
) {
  let finalClinicId: Types.ObjectId | undefined;
  const companyLink = await MAccountCompanyLink.findOne({
    companyId,
    accountId: account._id,
    isActive: true,
  });
  if (!companyLink) {
    throw new Error('Account is not a member of the company');
  }
  const company = await MCompany.findOne({ _id: companyId });
  if (!company) {
    throw new Error('Company does not exist');
  }
  const ownsCompany = company.ownedById.toHexString() === account._id.toHexString();
  const hasCompanyAdminPerm = computeHasCompanyAdminPerm(account, company, companyLink);
  console.log('hasCOmpany', hasCompanyAdminPerm);
  if (clinicId) {
    if (hasCompanyAdminPerm) {
      const clinic = await MClinic.findOne({ _id: clinicId });
      if (!clinic) {
        throw new Error('Account does not have access to clinic');
      }
    } else {
      const clinicLinkExists = !!(await MAccountCompanyClinicLink.findOne(
        { companyId, clinicId, accountId: account._id },
      ));
      if (!clinicLinkExists) {
        throw new Error('Account is not a member of the clinic');
      }
    }
    finalClinicId = clinicId;
  } else if (hasCompanyAdminPerm) {
    const clinic = await MClinic.findOne({ companyId });
    if (clinic) {
      finalClinicId = clinic._id;
    }
  } else {
    const clinicLink = await MAccountCompanyClinicLink.findOne(
      { companyId, clinicId, accountId: account._id },
    );
    if (clinicLink) {
      finalClinicId = clinicLink.clinicId;
    }
  }
  return { companyLink, clinicId: finalClinicId, ownsCompany };
}

export default async function generateAuthToken({
  account, companyId, clinicId,
}:{
  account: Account,
  companyId?: Types.ObjectId,
  clinicId?: Types.ObjectId,
}) {
  let companyIdToSign: Types.ObjectId | undefined;
  let clinicIdToSign: Types.ObjectId | undefined;
  let companyPermsToSign: CompanyPermShortKey[] | undefined;
  let ownsCompany: boolean | undefined;

  console.log('==sa=ds=d=', companyId, clinicId);

  if (!account.isAdmin) {
    let companyLink: AccountCompanyLink | undefined;
    if (companyId) {
      const companyAccess = await checkCompanyAndClinicAccess(
        account,
        companyId,
        clinicId,
      );
      companyIdToSign = companyId;
      clinicIdToSign = companyAccess.clinicId;
      companyLink = companyAccess.companyLink;
      ownsCompany = companyAccess.ownsCompany;
    } else if (account.lastUsedCompanyId) {
      const companyAccess = await checkCompanyAndClinicAccess(
        account,
        account.lastUsedCompanyId,
        account.lastUsedClinicId,
      );
      companyIdToSign = account.lastUsedCompanyId;
      clinicIdToSign = companyAccess.clinicId;
      companyLink = companyAccess.companyLink;
      ownsCompany = companyAccess.ownsCompany;
    }
    if (companyLink) {
      const lCompanyPermsToSign: CompanyPermShortKey[] = [];
      (companyLink.perms || []).forEach((p) => {
        const permObj = companyPerms.find((p1) => p1.key === p);
        if (permObj) {
          lCompanyPermsToSign.push(permObj.shortKey);
        }
      });
      companyPermsToSign = lCompanyPermsToSign;
    }
  }

  const objToSign = {
    aid: account._id.toHexString(),
    isa: !!account.isAdmin,
    cpr: companyPermsToSign, // company permissions
    own: ownsCompany, // account owns company
    coi: companyIdToSign ? companyIdToSign.toHexString() : undefined,
    cli: clinicIdToSign ? clinicIdToSign.toHexString() : undefined,
  };

  return jwt.sign(objToSign, config.JWT_AUTH_SECRET, { expiresIn: '30d' });
}
