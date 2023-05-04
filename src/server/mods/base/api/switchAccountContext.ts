import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import getErrorMessage from '../../../core/getErrorMessage';
import { authenticatedProcedure } from '../../../core/trpc';
import { MAccount } from '../db';
import generateAuthToken from '../utils/generateAuthToken';
import { RoleKey } from '../db/_types';

const switchAccountContext = authenticatedProcedure.input(
  z.object({
    roleKey: z.nativeEnum(RoleKey),
    companyId: z.optional(z.string()),
    clinicId: z.optional(z.string()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId } = ctx;
    const { companyId: iCompanyId, clinicId: iClinicId, roleKey } = input;

    const account = await MAccount.findOne({ accountId }).lean();

    if (roleKey === RoleKey.user) {
      if ((!iCompanyId && iClinicId) || (!iClinicId && iCompanyId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Company and clinic are required',
        });
      }
    } else if (iCompanyId || iClinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company or clinic cannot be added for provided role',
      });
    }

    if (roleKey === RoleKey.user && iClinicId && !iCompanyId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company should be provided',
      });
    }

    let authToken = '';

    try {
      authToken = await generateAuthToken({
        account,
        roleKey,
        companyId: iCompanyId ? new Types.ObjectId(iCompanyId) : undefined,
        clinicId: iClinicId ? new Types.ObjectId(iClinicId) : undefined,
      });
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: getErrorMessage(error),
      });
    }

    return authToken;
  });

export default switchAccountContext;
