import { model, Schema, Types } from 'mongoose';
import { Clinic } from './_types';

const ClinicSchema = new Schema(
  {
    name: { type: String, trim: true },
    companyId: { type: Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Clinic', timestamps: true },
);

const MClinic = model<Clinic>('Clinic', ClinicSchema);

export default MClinic;
