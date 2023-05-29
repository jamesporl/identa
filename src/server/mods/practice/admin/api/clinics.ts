import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { MClinic } from '../../../base/db';
import { authenticatedProcedure } from '../../../../core/trpc';

export const clinicZObj = z.object({
  _id: z.string(),
  name: z.string(),
});

const clinics = authenticatedProcedure.input(
  z.object({
    pageSize: z.number(),
    page: z.number(),
    searchString: z.optional(z.string()),
  }),
).output(
  z.object({
    nodes: clinicZObj.array(),
    totalCount: z.number(),
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
    const { page, pageSize, searchString } = input;
    const filter: { [key: string]: unknown } = { companyId };
    if (searchString) {
      const pattern = new RegExp(`^${searchString}`, 'i');
      filter['account.name'] = { $regex: pattern };
    }

    const totalCount = await MClinic.count(filter);
    const clinicDocs = await MClinic.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ 'account.name': 1 })
      .lean();

    const nodes = clinicDocs.map((c) => ({
      _id: c._id.toHexString(),
      name: c.name,
    }));

    return { nodes, totalCount };
  });

export default clinics;
