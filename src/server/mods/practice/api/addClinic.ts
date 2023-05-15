import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { MClinic } from '../../base/db';
import { authenticatedProcedure } from '../../../core/trpc';

const addClinic = authenticatedProcedure.input(
  z.object({
    name: z.string(),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { companyId, accountId } = ctx;
    const { name } = input;
    if (!companyId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }
    await new MClinic({
      name,
      companyId,
      isActive: true,
      createdById: accountId,
      updatedById: accountId,
    }).save();
  });

export default addClinic;
