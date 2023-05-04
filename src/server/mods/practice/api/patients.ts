import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { differenceInYears, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { authenticatedProcedure } from '../../../core/trpc';
import { MPatient, MPatientClinicLink } from '../db';
import { BirthSex } from '../db/_types';

function computeAge(dob: string) {
  const today = startOfDay(utcToZonedTime(new Date(), 'Asia/Manila'));
  return differenceInYears(today, new Date(dob));
}

const patients = authenticatedProcedure.input(
  z.object({
    pageSize: z.number(),
    page: z.number(),
    searchString: z.optional(z.string()),
  }),
).output(
  z.object({
    nodes: z.object({
      _id: z.string(),
      name: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      birthSex: z.nativeEnum(BirthSex),
      dob: z.string(),
      age: z.number(),
    }).array(),
    totalCount: z.number(),
  }),
)
  .query(async ({ input, ctx }) => {
    const { companyId, clinicId } = ctx;
    if (!companyId || !clinicId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Company not found',
      });
    }
    const { page, pageSize, searchString } = input;
    const filter: { [key: string]: unknown } = { companyId, clinicId };
    if (searchString) {
      const pattern = new RegExp(`/^${searchString}/`, 'i');
      filter.name = { $regex: pattern };
    }
    const totalCount = await MPatientClinicLink.count(filter);
    const ptLinks = await MPatientClinicLink.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ name: 1 })
      .lean();

    const ptIds = ptLinks.map((pt) => pt.patientId);

    const pts = await MPatient.find({ _id: { $in: ptIds } }).lean();

    const nodes = pts.map((pt) => ({
      _id: pt._id.toHexString(),
      name: pt.name,
      firstName: pt.firstName,
      lastName: pt.lastName,
      birthSex: pt.birthSex,
      dob: pt.dob,
      age: computeAge(pt.dob),
    }));

    return { nodes, totalCount };
  });

export default patients;
