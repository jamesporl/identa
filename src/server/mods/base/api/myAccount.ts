import { authenticatedProcedure } from '../../../core/trpc';
import { MAccount, MClinic, MCompany } from '../db';
import { RoleKey } from '../db/_types';

const myAccount = authenticatedProcedure.query(async ({ ctx }) => {
  const {
    accountId, roleKey, perms, companyId, clinicId,
  } = ctx;
  const account = await MAccount.findOne({ _id: accountId }).lean();

  let company: { _id: string, name: string } | undefined;
  let clinic: { _id: string, name: string } | undefined;
  if (companyId) {
    const companyDoc = await MCompany.findOne({ _id: companyId });
    if (companyDoc) {
      company = { _id: companyId.toHexString(), name: companyDoc.name };
    }

    if (clinicId) {
      const clinicDoc = await MClinic.findOne({ _id: clinicId });
      if (clinicDoc) {
        clinic = { _id: clinicId.toHexString(), name: clinicDoc.name };
      }
    }
  } else if (roleKey === RoleKey.user && account.lastUsedCompanyId && account.lastUsedClinicId) {
    const companyDoc = await MCompany.findOne({ _id: account.lastUsedCompanyId });
    const clinicDoc = await MClinic.findOne({ _id: account.lastUsedClinicId });
    if (companyDoc && clinicDoc) {
      company = { _id: companyDoc._id.toHexString(), name: companyDoc.name };
      clinic = { _id: clinicDoc._id.toHexString(), name: clinicDoc.name };
    }
  }

  return {
    _id: accountId?.toHexString(),
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    login: account.login,
    phone: account.phone,
    roles: account.roles,
    roleKey,
    perms,
    company,
    clinic,
  };
});

export default myAccount;
