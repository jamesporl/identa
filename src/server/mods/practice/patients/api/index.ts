import { router } from '../../../../core/trpc';
import addPatient from './addPatient';
import matchPatient from './matchPatient';
import patient from './patient';
import patients from './patients';

export default router({
  addPatient,
  matchPatient,
  patient,
  patients,
});
