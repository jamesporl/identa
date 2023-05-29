import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import getErrorMessage from '../../../core/getErrorMessage';
import { authenticatedProcedure } from '../../../core/trpc';
import { MAccount } from '../db';
import generateAuthToken from '../utils/generateAuthToken';

const switchAccountContext = authenticatedProcedure.input(
  z.object({
    companyId: z.string(),
    clinicId: z.optional(z.string()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId, isAdmin } = ctx;
    const { companyId: iCompanyId, clinicId: iClinicId } = input;

    const account = await MAccount.findOne({ _id: accountId }).lean();

    if (isAdmin) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Incorrect role',
      });
    }

    let authToken = '';

    try {
      authToken = await generateAuthToken({
        account,
        companyId: new Types.ObjectId(iCompanyId),
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
