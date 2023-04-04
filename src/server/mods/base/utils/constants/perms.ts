import { PermKey } from '../../db/_types';

export enum PermShortKey {
  su = 'su',
  mp = 'mp',
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
    key: PermKey.managePatients,
    label: 'Manage Patients',
    shortKey: PermShortKey.mp,
    desc: 'Allow users to create, view, update, and delete patients',
  },
];

export default perms;
