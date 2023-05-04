import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import { authenticatedProcedure } from '../../../core/trpc';
import {
  MAccount, MAccountCompanyClinicLink, MAccountCompanyLink, MClinic, MCompany,
} from '../db';
import { RoleKey } from '../db/_types';

const addCompanyByUser = authenticatedProcedure.input(
  z.object({
    name: z.string(),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId, roleKey } = ctx;
    const { name } = input;

    if (roleKey !== RoleKey.user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Incorrect role',
      });
    }

    const account = await MAccount.findOne({ _id: accountId });

    if (!(account?.email && account?.isEmailVerified && account?.email === account?.login)) {
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

    const newCompany = await new MCompany({
      _id: newCompanyId,
      name,
      ownedById: accountId,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    const newClinic = await new MClinic({
      name: 'Clinic 1',
      companyId: newCompany._id,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    await MAccount.updateOne(
      { _id: accountId },
      { $set: { lastUsedClinicId: newClinic._id, lastUsedCompanyId: newCompanyId } },
    );

    await new MAccountCompanyLink({ account, company: newCompany }).save();
    await new MAccountCompanyClinicLink({ account, company: newCompany, clinic: newClinic }).save();

    return {
      _id: newCompanyId.toHexString(),
      name,
    };
  });

export default addCompanyByUser;
