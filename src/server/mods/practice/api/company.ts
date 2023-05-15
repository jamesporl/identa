import { z } from 'zod';
import { MCompany } from '../../base/db';
import { companyAdminProcedure } from '../../../core/trpc';

const company = companyAdminProcedure.output(
  z.object({
    name: z.string(),
    loginPrefix: z.optional(z.string()),
  }),
)
  .query(async ({ ctx }) => {
    const { companyId } = ctx;
    const companyDoc = await MCompany.findOne({ _id: companyId });

    return { name: companyDoc?.name || '', loginPrefix: companyDoc?.loginPrefix };
  });

export default company;
