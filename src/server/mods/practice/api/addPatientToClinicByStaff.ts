import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../core/trpc';
import { MPatient, MPatientClinicLink } from '../db';
import { BirthSex } from '../db/_types';

const addPatientToClinicByStaff = authenticatedProcedure.input(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string(),
    birthSex: z.nativeEnum(BirthSex),
  }),
)
  .mutation(async ({ input, ctx }) => {
    const { companyId, clinicId, accountId } = ctx;
    const {
      firstName, lastName, dob, birthSex,
    } = input;
    if (!companyId || !clinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company or clinic not found',
      });
    }

    const name = `${lastName}, ${firstName}`;

    const newPatient = await new MPatient({
      companyId,
      firstName,
      lastName,
      name,
      dob,
      birthSex,
      createdById: accountId,
      updatedById: accountId,
    }).save();

    await new MPatientClinicLink({
      companyId,
      clinicId,
      patientId: newPatient._id,
      name,
      isActive: true,
      createdById: accountId,
      updatedById: accountId,
    }).save();
  });

export default addPatientToClinicByStaff;
