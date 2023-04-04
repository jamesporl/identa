import { router } from '../../../core/trpc';
import addCompanyByUser from './addCompanyByUser';
import login from './login';
import myAccount from './myAccount';
import signup from './signup';

export default router({
  addCompanyByUser,
  login,
  myAccount,
  signup,
});
