import { z } from 'zod';
import { Types } from 'mongoose';
import { TRPCError } from '@trpc/server';
import zxcvbn from 'zxcvbn';
import { CompanyPermKey } from '../../../base/db/_types';
import { authenticatedProcedure } from '../../../../core/trpc';
import hashPassword from '../../../base/utils/hashPassword';
import {
  MAccount, MAccountCompanyClinicLink, MAccountCompanyLink, MClinic,
} from '../../../base/db';

const addAccount = authenticatedProcedure.input(
  z.object({
    name: z.string(),
    login: z.string().trim().toLowerCase(),
    password: z.string(),
    isPractitioner: z.optional(z.boolean()),
    companyPerms: z.optional(z.nativeEnum(CompanyPermKey).array()),
    clinicIds: z.optional(z.string().array()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { companyId, clinicId, accountId } = ctx;
    const {
      name, login, password, isPractitioner, companyPerms, clinicIds: iClinicIds,
    } = input;
    if (!companyId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }

    let clinicIds: Types.ObjectId[] = [];
    if (iClinicIds?.length) {
      if (new Set(iClinicIds).size !== iClinicIds.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Clinic IDs are duplicated',
        });
      }
      clinicIds = iClinicIds.map((id) => new Types.ObjectId(id));
      const clinics = await MClinic.find({ _id: { $in: clinicIds }, companyId });
      if (clinics.length !== iClinicIds.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Clinic not found',
        });
      }
    } else {
      const companyClinics = await MClinic.find({ companyId }).limit(2);
      if (companyClinics.length > 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Clinic is required',
        });
      } else {
        clinicIds = [companyClinics[0]._id];
      }
    }

    const pwStrength = zxcvbn(password);
    if (pwStrength.score < 2) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please set a stronger password',
      });
    }

    const hashedPw = await hashPassword(password);

    const loginMatches = await MAccount.find({ login });
    if (loginMatches.length) {
      const loginMatchIds = loginMatches.map((a) => a._id);
      const companyLink = await MAccountCompanyLink.findOne({
        companyId,
        accountId: { $in: loginMatchIds },
      });
      if (companyLink) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username is already taken',
        });
      }
    }

    const newAccountId = new Types.ObjectId();

    await new MAccount({
      _id: newAccountId,
      name,
      username: login, // todo: support for username login
      login,
      password: hashedPw,
      lastUsedCompanyId: companyId,
      lastUsedClinicId: clinicId,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    await new MAccountCompanyLink({
      accountId: newAccountId,
      companyId,
      name,
      isPractitioner,
      perms: companyPerms || [],
      isActive: true,
    }).save();

    await Promise.all((clinicIds).map(async (cId) => {
      // eslint-disable-next-line no-await-in-loop
      await new MAccountCompanyClinicLink({
        accountId: newAccountId,
        clinicId: cId,
        companyId,
        name,
        isPractitioner,
      }).save();
    }));
  });

export default addAccount;
