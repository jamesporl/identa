import { router } from './trpc';
import baseRouter from '../mods/base/api';
import practiceAdminRouter from '../mods/practice/admin/api';
import practicePatientsRouter from '../mods/practice/patients/api';
import practiceVisitsRouter from '../mods/practice/visits/api';

export const appTrpcRouter = router({
  base: baseRouter,
  practiceAdmin: practiceAdminRouter,
  practicePatients: practicePatientsRouter,
  practiceVisits: practiceVisitsRouter,
});

// export type definition of API
export type AppTrpcRouter = typeof appTrpcRouter;
