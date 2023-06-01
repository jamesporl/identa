import { z } from 'zod';
import { authenticatedProcedure } from '../../../core/trpc';
import {
  MAccount, MAccountCompanyLink, MClinic, MCompany,
} from '../db';
import { CompanyPermKey } from '../db/_types';

export const myAccountZObj = z.object({
  _id: z.string(),
  name: z.string(),
  login: z.string(),
  email: z.optional(z.string()),
  isAdmin: z.optional(z.boolean()),
  title: z.optional(z.string()),
  phone: z.optional(z.string()),
  image: z.optional(z.string()),
  isPractitioner: z.optional(z.boolean()),
  company: z.optional(z.object({
    _id: z.string(),
    name: z.string(),
  })),
  clinic: z.optional(z.object({
    _id: z.string(),
    name: z.string(),
  })),
  companyPerms: z.optional(z.nativeEnum(CompanyPermKey).array()),
  companyImage: z.optional(z.string()),
});

const myAccount = authenticatedProcedure
  .output(myAccountZObj)
  .query(async ({ ctx }) => {
    const { accountId, companyId, clinicId } = ctx;
    const account = await MAccount.findOne({ _id: accountId }).lean();

    let name = '';
    let image = '';
    let title = '';
    let phone = '';
    let isPractitioner = false;
    let companyImage = '';
    let company: { _id: string, name: string } | undefined;
    let clinic: { _id: string, name: string } | undefined;
    const companyPerms: CompanyPermKey[] = [];

    if (!account.isAdmin) {
      name = account.login;
      if (companyId) {
        const companyDoc = await MCompany.findOne({ _id: companyId });
        if (companyDoc) {
          company = { _id: companyId.toHexString(), name: companyDoc.name };
          companyImage = companyDoc.image || '';
        }

        const companyLink = await MAccountCompanyLink.findOne({ companyId, accountId });
        if (companyLink) {
          name = companyLink.name;
          image = companyLink.image || '';
          title = companyLink.title || '';
          phone = companyLink.phone || '';
          isPractitioner = !!companyLink.isPractitioner;
        }
        if (clinicId) {
          const clinicDoc = await MClinic.findOne({ _id: clinicId });
          if (clinicDoc) {
            clinic = { _id: clinicId.toHexString(), name: clinicDoc.name };
          }
        }
      }
    } else {
      name = account.name;
      image = account.image || '';
      title = account.title || '';
      phone = account.phone || '';
    }

    return {
      _id: accountId?.toHexString(),
      name,
      login: account.login,
      email: account.email,
      phone,
      image,
      title,
      isAdmin: !!account.isAdmin,
      isPractitioner,
      companyPerms,
      company,
      clinic,
      companyImage,
    };
  });

export default myAccount;
