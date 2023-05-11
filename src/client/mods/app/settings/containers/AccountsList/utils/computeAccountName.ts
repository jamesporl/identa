import { RouterOutput } from 'utils/trpc';

export type Account = RouterOutput['practice']['accounts']['nodes'][number];

export default function computeAccountName(account: Account) {
  const {
    firstName, lastName, nameSuffix, professionalSuffix,
  } = account;
  let name = [firstName, lastName, nameSuffix].filter((n) => !!n).join(' ');
  if (professionalSuffix) {
    name = `${name}, ${professionalSuffix}`;
  }
  return name;
}
