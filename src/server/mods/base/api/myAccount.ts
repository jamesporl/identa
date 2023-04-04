import { authenticatedProcedure } from '../../../core/trpc';
import { MAccount } from '../db';

const myAccount = authenticatedProcedure.query(async ({ ctx }) => {
  const { accountId, roleKey, perms } = ctx;
  const account = await MAccount.findOne({ _id: accountId }).lean();

  return {
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    login: account.login,
    phone: account.phone,
    roles: account.roles,
    roleKey,
    perms,
  };
});

export default myAccount;
