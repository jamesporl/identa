import { router } from '../../../core/trpc';
import addCompanyByUser from './addCompanyByUser';
import login from './login';
import myAccount from './myAccount';
import signup from './signup';
import switchAccountContext from './switchAccountContext';
import verifyEmailByCode from './verifyEmailByCode';

export default router({
  addCompanyByUser,
  verifyEmailByCode,
  login,
  myAccount,
  switchAccountContext,
  signup,
});
