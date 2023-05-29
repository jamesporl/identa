import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { MCompany } from '../../../base/db';
import { companyAdminProcedure } from '../../../../core/trpc';

const company = companyAdminProcedure.output(
  z.object({
    name: z.string(),
    loginPrefix: z.string(),
  }),
)
  .query(async ({ ctx }) => {
    const { companyId } = ctx;
    const companyDoc = await MCompany.findOne({ _id: companyId });
    if (!companyDoc) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }

    return { name: companyDoc.name || '', loginPrefix: companyDoc.loginPrefix };
  });

export default company;
