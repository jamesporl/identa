import { Document, Types } from 'mongoose';

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
