// import { TRPCError } from '@trpc/server';
// import { z } from 'zod';
// import { authenticatedProcedure } from '../../../core/trpc';
// import { MClinic, MCompany } from '../db';
// import { PermKey, RoleKey } from '../db/_types';

// export const myClinicZObj = z.object({
//   _id: z.string(),
//   name: z.string(),
// });

// const myClinics = authenticatedProcedure.input(
//   z.object({
//     pageSize: z.number(),
//     page: z.number(),
//     searchString: z.optional(z.string()),
//   }),
// ).output(
//   z.object({
//     nodes: myClinicZObj.array(),
//     totalCount: z.number(),
//   }),
// ).query(async ({ ctx, input }) => {
//   const { page, pageSize, searchString } = input;
//   const {
//     accountId, roleKey, perms, companyId, clinicId,
//   } = ctx;

//   if (!companyId) {
//     throw new TRPCError({
//       code: 'BAD_REQUEST',
//       message: 'Company not found',
//     });
//   }

//   let nodes: z.infer<typeof myClinicZObj>[] = [];
//   let totalCount = 0;

//   if (perms.includes(PermKey.companyAdmin)) {
//     const filter: { [key: string]: unknown } = { companyId };
//     if (searchString) {
//       const pattern = new RegExp(`^${searchString}`, 'i');
//       filter.name = { $regex: pattern };
//     }
//     totalCount = await MClinic.countDocuments(filter);
//     const clinicDocs = await MClinic.find(filter);
//     nodes = clinicDocs
//   }

//   let company: { _id: string, name: string } | undefined;
//   let clinic: { _id: string, name: string } | undefined;
//   if (companyId) {
//     const companyDoc = await MCompany.findOne({ _id: companyId });
//     if (companyDoc) {
//       company = { _id: companyId.toHexString(), name: companyDoc.name };
//     }

//     if (clinicId) {
//       const clinicDoc = await MClinic.findOne({ _id: clinicId });
//       if (clinicDoc) {
//         clinic = { _id: clinicId.toHexString(), name: clinicDoc.name };
//       }
//     }
//   } else if (roleKey === RoleKey.user && account.lastUsedCompanyId && account.lastUsedClinicId) {
//     const companyDoc = await MCompany.findOne({ _id: account.lastUsedCompanyId });
//     const clinicDoc = await MClinic.findOne({ _id: account.lastUsedClinicId });
//     if (companyDoc && clinicDoc) {
//       company = { _id: companyDoc._id.toHexString(), name: companyDoc.name };
//       clinic = { _id: clinicDoc._id.toHexString(), name: clinicDoc.name };
//     }
//   }

//   return {
//     _id: accountId?.toHexString(),
//     firstName: account.firstName,
//     lastName: account.lastName,
//     email: account.email,
//     login: account.login,
//     phone: account.phone,
//     roles: account.roles,
//     isPractitioner: account.isPractitioner,
//     roleKey,
//     perms,
//     company,
//     clinic,
//   };
// });

// export default myClinics;
