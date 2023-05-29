import { model, Schema, Types } from 'mongoose';
import { BIRTH_SEX_VALUES, Patient } from '../../db/_types';

const PatientSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    dob: { type: String, required: true },
    name: { type: String, required: true },
    birthSex: { type: String, required: true, enum: BIRTH_SEX_VALUES },
    middleName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Patient', timestamps: true },
);

const MPatient = model<Patient>('Patient', PatientSchema);
PatientSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });

export default MPatient;
