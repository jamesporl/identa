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
  phone?: string;
  isEmailValidated: boolean;
  isActive: boolean;
  password: string;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  roles: AccountRole[];
  createdAt: Date;
  updatedAt: Date;
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
