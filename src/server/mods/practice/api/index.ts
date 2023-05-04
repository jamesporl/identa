import { router } from '../../../core/trpc';
import addPatientToClinicByStaff from './addPatientToClinicByStaff';
import matchPatient from './matchPatient';
import patients from './patients';

export default router({
  addPatientToClinicByStaff,
  matchPatient,
  patients,
});
