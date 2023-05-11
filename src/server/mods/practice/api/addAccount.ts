import { z } from 'zod';
import { Types } from 'mongoose';
import { TRPCError } from '@trpc/server';
import zxcvbn from 'zxcvbn';
import hashPassword from '../../base/utils/hashPassword';
import {
  MAccount, MAccountCompanyClinicLink, MAccountCompanyLink, MClinic, MCompany,
} from '../../base/db';
import { RoleKey } from '../../base/db/_types';
import { authenticatedProcedure } from '../../../core/trpc';

const addAccount = authenticatedProcedure.input(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    login: z.string(),
    password: z.string(),
    nameSuffix: z.optional(z.string()),
    professionalSuffix: z.optional(z.string()),
    title: z.optional(z.string()),
    isPractitioner: z.boolean(),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { companyId, clinicId, accountId } = ctx;
    const {
      firstName, lastName, login, password, nameSuffix, professionalSuffix, title, isPractitioner,
    } = input;
    if (!companyId || !clinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company or clinic not found',
      });
    }

    const pwStrength = zxcvbn(password);
    if (pwStrength.score < 2) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please set a stronger password',
      });
    }

    const name = `${firstName} ${lastName}`;

    const hashedPw = await hashPassword(password);

    const emailExists = await MAccount.findOne({ login });
    if (emailExists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email is already taken',
      });
    }

    const company = await MCompany.findOne({ _id: companyId });
    const clinic = await MClinic.findOne({ _id: clinicId });

    const newAccountId = new Types.ObjectId();

    await new MAccount({
      _id: newAccountId,
      firstName,
      lastName,
      name,
      email: login, // todo: support for username login
      nameSuffix,
      professionalSuffix,
      title,
      isPractitioner,
      login,
      password: hashedPw,
      roles: [{ roleKey: RoleKey.user, perms: [] }],
      lastUsedCompanyId: companyId,
      lastUsedClinicId: clinicId,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    await new MAccountCompanyLink({
      account: { _id: newAccountId, name },
      company: { _id: companyId, name: company?.name },
      isPractitioner,
    }).save();

    await new MAccountCompanyClinicLink({
      account: { _id: newAccountId, name },
      company: { _id: companyId, name: company?.name },
      clinic: { _id: clinicId, name: clinic?.name },
      isPractitioner,
    }).save();
  });

export default addAccount;
