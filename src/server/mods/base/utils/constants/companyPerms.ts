import { CompanyPermKey } from '../../db/_types';

export enum CompanyPermShortKey {
  ca = 'ca',
}

interface CompanyPermObj {
  key: CompanyPermKey;
  label: string;
  shortKey: CompanyPermShortKey;
  desc: string;
}

const companyPerms: CompanyPermObj[] = [
  {
    key: CompanyPermKey.companyAdmin,
    label: 'Company Admin',
    shortKey: CompanyPermShortKey.ca,
    desc: 'Allows a user to manage some company and clinic settings, accounts, and other administrative functionalities',
  },
];

export default companyPerms;
