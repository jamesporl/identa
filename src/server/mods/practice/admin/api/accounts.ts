import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { MAccount, MAccountCompanyLink } from '../../../base/db';
import { authenticatedProcedure } from '../../../../core/trpc';
import { AccountsFilter } from './_types';

export const accountZObj = z.object({
  _id: z.string(),
  name: z.string(),
  login: z.string(),
  title: z.optional(z.string()),
  phone: z.optional(z.string()),
  image: z.optional(z.string()),
  isPractitioner: z.boolean(),
});

const accounts = authenticatedProcedure.input(
  z.object({
    pageSize: z.number(),
    page: z.number(),
    searchString: z.optional(z.string()),
    filters: z.optional(z.nativeEnum(AccountsFilter).array()),
  }),
).output(
  z.object({
    nodes: accountZObj.array(),
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
      page, pageSize, searchString, filters,
    } = input;
    const filter: { [key: string]: unknown } = { companyId };
    if (searchString) {
      const pattern = new RegExp(`^${searchString}`, 'i');
      filter.name = { $regex: pattern };
    }
    if (filters?.length) {
      if (filters.includes(AccountsFilter.practitioners)) {
        filter.isPractitioner = true;
      }
    }
    const totalCount = await MAccountCompanyLink.count(filter);
    const links = await MAccountCompanyLink.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ 'account.name': 1 })
      .lean();

    const accountIds = links.map((l) => l.accountId);
    const accountDocs = await MAccount.find({ _id: { $in: accountIds } }).lean();

    const nodes = links.map((link) => {
      const account = accountDocs.find(
        (a) => a._id.toHexString() === link.accountId.toHexString(),
      );
      return {
        _id: account?._id.toHexString() || '',
        name: link.name,
        login: account?.login || '',
        isPractitioner: link.isPractitioner,
        title: link.title,
        phone: link.phone,
        image: link.image,
      };
    });

    return { nodes, totalCount };
  });

export default accounts;
