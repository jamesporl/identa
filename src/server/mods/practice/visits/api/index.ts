import { router } from '../../../../core/trpc';
import addVisits from './addVisits';
import visits from './visits';

export default router({
  addVisits,
  visits,
});
