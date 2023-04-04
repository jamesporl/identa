import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../core/trpc';
import { MCompany } from '../db';

const addCompanyByUser = authenticatedProcedure.input(
  z.object({
    name: z.string(),
    loginPrefix: z.string()
      .toLowerCase()
      .regex(/^[a-z0-9]+$/i, { message: 'Must be alphanumeric' })
      .min(3, { message: 'Must be 3-12 characters long' })
      .max(12, { message: 'Must be 3-12 characters long' }),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { accountId } = ctx;
    const { name, loginPrefix } = input;
    const loginPrefixExists = !!(await MCompany.findOne({ loginPrefix }));

    if (loginPrefixExists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Login prefix is taken',
      });
    }

    // todo: validate if user has existing owned company already
    const newCompany = await new MCompany({
      name,
      loginPrefix,
      ownedById: accountId,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    return newCompany.toObject();
  });

export default addCompanyByUser;
