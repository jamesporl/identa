import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../../core/trpc';
import { MPatient } from '../db';

const maskEmail = (email: string) => {
  const result = '';
  if (email) {
    const emailSplit = email.split('@');
    return `${emailSplit[0].slice(0, 3)}***${emailSplit[0].slice(-1)}.@${emailSplit[1]}`;
  }
  return result;
};

const matchPatient = authenticatedProcedure.input(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string().datetime(),
  }),
)
  .query(async ({ input, ctx }) => {
    const { companyId } = ctx;
    if (!companyId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }
    const { firstName, lastName, dob } = input;
    const name = `${firstName} ${lastName}`;
    const patients = await MPatient.find({
      companyId,
      name,
      dob,
    }).limit(50).lean();

    return patients.map((p) => ({
      _id: p._id.toHexString(),
      firstName: p.firstName,
      lastName: p.lastName,
      dob: p.dob,
      email: maskEmail(p?.email || ''),
      phone: p.phone,
    }));
  });

export default matchPatient;
