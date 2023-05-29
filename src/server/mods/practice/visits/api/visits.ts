import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { MAccount } from '../../../base/db';
import { authenticatedProcedure } from '../../../../core/trpc';
import { MVisit } from '../db';
import { MPatient } from '../../patients/db';

// todo: validate page size

export const visitZObj = z.object({
  _id: z.string(),
  account: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  patient: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  reason: z.optional(z.string()),
});

const visits = authenticatedProcedure.input(
  z.object({
    pageSize: z.number(),
    page: z.number(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
  }),
).output(
  z.object({
    nodes: visitZObj.array(),
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
    const {
      page, pageSize, startAt, endAt,
    } = input;
    const filter: { [key: string]: unknown } = {
      companyId,
      clinicId,
      startAt: { $gte: startAt },
      endAt: { $lte: endAt },
    };

    const totalCount = await MVisit.count(filter);
    const visitDocs = await MVisit.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ _id: 1, startAt: 1 })
      .lean();

    const accountIds = visitDocs.map((v) => v.accountId);
    const accountDocs = await MAccount.find(
      { _id: { $in: accountIds } },
      { _id: 1, name: 1 },
    ).lean();

    const patientIds = visitDocs.map((v) => v.patientId);
    const patientDocs = await MPatient.find(
      { _id: { $in: patientIds } },
      { _id: 1, name: 1 },
    ).lean();

    const nodes = visitDocs.map((visit) => {
      const account = accountDocs.find(
        (a) => a._id.toHexString() === visit.accountId.toHexString(),
      );
      const patient = patientDocs.find(
        (pt) => pt._id.toHexString() === visit.patientId.toHexString(),
      );
      return {
        _id: visit._id.toHexString(),
        account: {
          _id: account?._id.toHexString() || 'error',
          name: account?.name || 'error',
        },
        patient: {
          _id: patient?._id.toHexString() || 'error',
          name: patient?.name || 'error',
        },
        startAt: visit.startAt.toISOString(),
        endAt: visit.endAt.toISOString(),
        reason: visit.reason,
      };
    });

    return { nodes, totalCount };
  });

export default visits;
