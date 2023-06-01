import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../core/trpc';
import { MAccount, MAccountCompanyClinicLink, MAccountCompanyLink } from '../db';

const updateMyAccount = authenticatedProcedure.input(
  z.object({
    name: z.string(),
    title: z.optional(z.string()),
    phone: z.optional(z.string()),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId, companyId } = ctx;
    const { name, title, phone } = input;

    if (!companyId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Incorrect role',
      });
    }

    await MAccountCompanyLink.updateOne(
      { companyId, accountId },
      { $set: { name, title, phone } },
    );

    await MAccountCompanyClinicLink.updateMany(
      { companyId, accountId },
      { $set: { name } },
    );

    await MAccount.updateOne(
      { _id: accountId },
      { $set: { name, title, phone } },
    );
  });

export default updateMyAccount;
