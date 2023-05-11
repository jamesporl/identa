import { Document, Types } from 'mongoose';

export enum BirthSex {
  m = 'm',
  f = 'f',
  u = 'u',
}

export const BIRTH_SEX_VALUES = Object.values(BirthSex);

export interface Patient extends Document {
  companyId: Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  name: string;
  dob: string;
  isActive: boolean;
  email?: string;
  phone?: string;
  birthSex: BirthSex;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientClinicLink extends Document {
  companyId: Types.ObjectId;
  clinicId: Types.ObjectId;
  patientId: Types.ObjectId;
  name: string;
  isActive: boolean;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit extends Document {
  companyId: Types.ObjectId;
  clinicId: Types.ObjectId;
  patientId: Types.ObjectId;
  accountId: Types.ObjectId;
  startAt: Date;
  endAt: Date;
  reason?: string;
  createdById: Types.ObjectId;
  updatedById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
