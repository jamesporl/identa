import { router } from '../../../core/trpc';
import accounts from './accounts';
import addAccount from './addAccount';
import addClinic from './addClinic';
import addPatientToClinicByStaff from './addPatientToClinicByStaff';
import addVisits from './addVisits';
import clinics from './clinics';
import company from './company';
import matchPatient from './matchPatient';
import patient from './patient';
import patients from './patients';
import visits from './visits';

export default router({
  accounts,
  addAccount,
  addClinic,
  addPatientToClinicByStaff,
  addVisits,
  clinics,
  company,
  matchPatient,
  patient,
  patients,
  visits,
});
