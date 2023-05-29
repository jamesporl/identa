import { Document, Types } from 'mongoose';

export enum CompanyPermKey {
  companyAdmin = 'companyAdmin',
}

export const COMPANY_PERM_KEY_VALUES = Object.values(CompanyPermKey);

export interface Address {
  line1?: string;
  line2?: string;
  brgy?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export interface Account extends Document {
  login: string;
  email?: string;
  username?: string;
  name: string;
  phone?: string;
  title?: string;
  image?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  password: string;
  isAdmin: boolean;
  lastUsedCompanyId?: Types.ObjectId;
  lastUsedClinicId?: Types.ObjectId;
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
  loginPrefix: string;
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
  address?: Address;
  isActive: boolean;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountCompanyLink extends Document {
  companyId: Types.ObjectId;
  accountId: Types.ObjectId;
  name: string;
  isPractitioner: boolean;
  isActive: boolean;
  phone?: string;
  hexColor?: string;
  title?: string;
  image?: string;
  perms: CompanyPermKey[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountCompanyClinicLink extends Document {
  companyId: Types.ObjectId;
  clinicId: Types.ObjectId;
  accountId: Types.ObjectId;
  name: string;
  isPractitioner: boolean;
  createdAt: Date;
  updatedAt: Date;
}
