import { router } from '../../../core/trpc';
import addCompany from './addCompany';
import login from './login';
import myAccount from './myAccount';
import signup from './signup';
import switchAccountContext from './switchAccountContext';
import updateMyAccount from './updateMyAccount';
import verifyEmailByCode from './verifyEmailByCode';

export default router({
  addCompany,
  login,
  myAccount,
  switchAccountContext,
  signup,
  updateMyAccount,
  verifyEmailByCode,
});
