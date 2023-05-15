import { PermKey } from '../../db/_types';

export enum PermShortKey {
  su = 'su',
  ca = 'ca',
}

interface PermObj {
  key: PermKey;
  label: string;
  shortKey: PermShortKey;
  desc: string;
}

const perms: PermObj[] = [
  {
    key: PermKey.superAdmin,
    label: 'Super Admin',
    shortKey: PermShortKey.su,
    desc: 'Access all data and perform all kinds of actions on them',
  },
  {
    key: PermKey.companyAdmin,
    label: 'Company Admin',
    shortKey: PermShortKey.ca,
    desc: 'Allows a user to manage some company and clinic settings, accounts, and other administrative functionalities',
  },
];

export default perms;
