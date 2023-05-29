import { router } from '../../../../core/trpc';
import accounts from './accounts';
import addAccount from './addAccount';
import addClinic from './addClinic';
import clinics from './clinics';
import company from './company';

export default router({
  accounts,
  addAccount,
  addClinic,
  clinics,
  company,
});
