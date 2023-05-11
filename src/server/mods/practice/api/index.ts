import { router } from '../../../core/trpc';
import accounts from './accounts';
import addAccount from './addAccount';
import addPatientToClinicByStaff from './addPatientToClinicByStaff';
import addVisits from './addVisits';
import matchPatient from './matchPatient';
import patient from './patient';
import patients from './patients';
import visits from './visits';

export default router({
  accounts,
  addAccount,
  addPatientToClinicByStaff,
  addVisits,
  matchPatient,
  patient,
  patients,
  visits,
});
