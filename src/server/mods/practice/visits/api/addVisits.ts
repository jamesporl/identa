import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import { authenticatedProcedure } from '../../../../core/trpc';
import { MVisit } from '../db';

// todo: support multiple visits
const addVisits = authenticatedProcedure.input(
  z.object({
    patientId: z.string(),
    accountId: z.string(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    reason: z.optional(z.string()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { companyId, clinicId, accountId: ctxAccountId } = ctx;
    const {
      patientId, accountId, startAt: startAtStr, endAt: endAtStr, reason,
    } = input;
    if (!companyId || !clinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company or clinic not found',
      });
    }

    const startAt = new Date(startAtStr);
    const endAt = new Date(endAtStr);

    // todo: add validations here

    await new MVisit({
      companyId,
      clinicId,
      patientId: new Types.ObjectId(patientId),
      accountId: new Types.ObjectId(accountId),
      startAt,
      endAt,
      reason,
      createdById: ctxAccountId,
      updatedById: ctxAccountId,
    }).save();
  });

export default addVisits;
