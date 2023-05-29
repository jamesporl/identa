import { model, Schema, Types } from 'mongoose';
import { PatientClinicLink } from '../../db/_types';

const PatientClinicLinkSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true },
    clinicId: { type: Types.ObjectId, required: true },
    patientId: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'PatientClinicLink', timestamps: true },
);

const MPatientClinicLink = model<PatientClinicLink>('PatientClinicLink', PatientClinicLinkSchema);

export default MPatientClinicLink;
