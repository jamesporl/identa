import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import { authenticatedProcedure } from '../../../core/trpc';
import {
  MAccount, MAccountCompanyClinicLink, MAccountCompanyLink, MClinic, MCompany,
} from '../db';
import { CompanyPermKey } from '../db/_types';
import getRandomColor from '../utils/getRandomColor';

async function generateCompanyLoginPrefix(name: string) {
  // Get first work, remove non-alpha numeric characters, cut to maximum 8 characters
  let result = name
    .toLowerCase()
    .split(' ')[0]
    .split('')
    .filter((s) => s.match(/^[a-z0-9]+$/))
    .join('')
    .slice(0, 8);
  if (result) {
    const baseName = result;
    let alreadyUsed = true;
    let counter = 1;
    while (alreadyUsed) {
    // eslint-disable-next-line no-await-in-loop
      const existingCompany = await MCompany.findOne({ loginPrefix: result });
      if (!existingCompany) {
        alreadyUsed = false;
      } else {
        result = `${baseName}${counter}`;
        counter += 1;
      }
    }
  } else {
    let alreadyUsed = true;
    let counter = Math.floor(Math.random() * 999);
    result = `company${counter}`;
    while (alreadyUsed) {
    // eslint-disable-next-line no-await-in-loop
      const existingCompany = await MCompany.findOne({ loginPrefix: result });
      if (!existingCompany) {
        alreadyUsed = false;
      } else {
        result = `company${counter}`;
        counter = Math.floor(Math.random() * 999);
      }
    }
  }

  return result;
}
const addCompany = authenticatedProcedure.input(
  z.object({
    name: z.string(),
    isPractitioner: z.optional(z.boolean()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId, isAdmin } = ctx;
    const { name, isPractitioner } = input;

    if (isAdmin) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Incorrect role',
      });
    }

    const account = await MAccount.findOne({ _id: accountId });

    if (!account) {
      throw new Error('Account not found');
    }

    if (!(account.email && account.isEmailVerified && account?.email === account.login)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Account must have a verified email',
      });
    }

    // Only allow owning one company per user for now
    const existingCompany = await MCompany.findOne({ ownedById: accountId });
    if (existingCompany) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company creation limit reached',
      });
    }

    const newCompanyId = new Types.ObjectId();

    const loginPrefix = await generateCompanyLoginPrefix(name);

    const newCompany = await new MCompany({
      _id: newCompanyId,
      name,
      loginPrefix,
      ownedById: accountId,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    const newClinic = await new MClinic({
      name,
      companyId: newCompany._id,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    await MAccount.updateOne(
      { _id: accountId },
      { $set: { lastUsedClinicId: newClinic._id, lastUsedCompanyId: newCompanyId } },
    );

    await new MAccountCompanyLink({
      companyId: newCompany._id,
      accountId,
      name: account.name,
      isPractitioner: !!isPractitioner,
      hexColor: getRandomColor(),
      isActive: true,
      perms: [CompanyPermKey.companyAdmin],
    }).save();

    await new MAccountCompanyClinicLink({
      companyId: newCompany._id,
      accountId,
      clinicId: newClinic._id,
      name: account.email.split('@')[0],
      isPractitioner: !!isPractitioner,
    }).save();

    return {
      _id: newCompanyId.toHexString(),
      name,
      clinic: {
        _id: newClinic._id.toHexString(),
        name,
      },
    };
  });

export default addCompany;
