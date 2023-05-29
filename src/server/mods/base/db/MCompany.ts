import { model, Schema, Types } from 'mongoose';
import { Company } from './_types';

const CompanySchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    loginPrefix: {
      type: String, trim: true, lowercase: true, required: true, unique: true,
    },
    isActive: { type: Boolean, default: true },
    ownedById: { type: Types.ObjectId },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Company', timestamps: true },
);

CompanySchema.index({ loginPrefix: 1 });

const MCompany = model<Company>('Company', CompanySchema);

export default MCompany;
