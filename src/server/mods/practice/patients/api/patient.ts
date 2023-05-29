import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../../core/trpc';
import { MPatient, MPatientClinicLink } from '../db';
import { computeAge, patientZObj } from './patients';

const patient = authenticatedProcedure.input(
  z.object({
    patientId: z.string(),
  }),
).output(patientZObj)
  .query(async ({ input, ctx }) => {
    const { companyId, clinicId } = ctx;
    if (!companyId || !clinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }

    const { patientId } = input;
    const ptLinkDoc = await MPatientClinicLink.findOne(
      { companyId, patientId, clinicId },
    ).lean();

    if (!ptLinkDoc) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Patient not found',
      });
    }

    const ptDoc = await MPatient.findOne({ _id: patientId }).lean();

    return {
      _id: ptDoc._id.toHexString(),
      name: ptDoc.name,
      firstName: ptDoc.firstName,
      lastName: ptDoc.lastName,
      birthSex: ptDoc.birthSex,
      dob: ptDoc.dob,
      age: computeAge(ptDoc.dob),
    };
  });

export default patient;
