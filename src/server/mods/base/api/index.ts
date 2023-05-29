import { router } from '../../../core/trpc';
import addCompany from './addCompany';
import login from './login';
import myAccount from './myAccount';
import signup from './signup';
import switchAccountContext from './switchAccountContext';
import verifyEmailByCode from './verifyEmailByCode';

export default router({
  addCompany,
  verifyEmailByCode,
  login,
  myAccount,
  switchAccountContext,
  signup,
});
