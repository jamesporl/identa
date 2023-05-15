import { model, Schema, Types } from 'mongoose';
import { Clinic } from './_types';
import AddressSchema from './common/AddressSchema';

const ClinicSchema = new Schema(
  {
    name: { type: String, trim: true },
    companyId: { type: Types.ObjectId, required: true },
    address: { type: AddressSchema },
    isActive: { type: Boolean, default: true },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Clinic', timestamps: true },
);

const MClinic = model<Clinic>('Clinic', ClinicSchema);

export default MClinic;
