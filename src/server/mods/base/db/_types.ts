import { Document, Types } from 'mongoose';

export enum RoleKey {
  admin = 'appAdmin',
  user = 'user',
}

export const ROLE_KEY_VALUES = Object.values(RoleKey);

export enum PermKey {
  managePatients = 'managePatients',
  superAdmin = 'superAdmin',
}

export const PERM_KEY_VALUES = Object.values(RoleKey);

export interface AccountRole {
  roleKey: RoleKey;
  perms: PermKey[];
}

export interface Account extends Document {
  login: string;
  email?: string;
  username?: string;
  firstName: string;
  lastName: string;
  name: string;
  hexColor?: string;
  isPractitioner: boolean;
  title?: string;
  phone?: string;
  nameSuffix?: string;
  professionalSuffix?: string;
  isEmailVerified: boolean;
  password: string;
  lastUsedCompanyId?: Types.ObjectId;
  lastUsedClinicId?: Types.ObjectId;
  roles: AccountRole[];
  isActive: boolean;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountEmailVerCode extends Document {
  accountId: Types.ObjectId;
  code: string;
  attempts: number;
  sentAt: Date;
}

export interface Company extends Document {
  name: string;
  ownedById: Types.ObjectId;
  isActive: boolean;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clinic extends Document {
  name: string;
  companyId: Types.ObjectId;
  isActive: boolean;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimpleAccount {
  _id: Types.ObjectId;
  name: string;
}

export interface SimpleCompany {
  _id: Types.ObjectId;
  name: string;
}

export interface SimpleClinic {
  _id: Types.ObjectId;
  name: string;
}

export interface AccountCompanyLink extends Document {
  account: SimpleAccount;
  company: SimpleCompany;
  isPractitioner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountCompanyClinicLink extends Document {
  account: SimpleAccount;
  company: SimpleCompany;
  isPractitioner: boolean;
  clinic: SimpleClinic;
  createdAt: Date;
  updatedAt: Date;
}
