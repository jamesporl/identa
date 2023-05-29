import { model, Schema, Types } from 'mongoose';
import { AccountCompanyClinicLink } from './_types';

const AccountCompanyClinicLinkSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true },
    clinicId: { type: Types.ObjectId, required: true },
    accountId: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    isPractitioner: { type: Boolean, default: false },
  },
  { collection: 'AccountCompanyClinicLink', timestamps: true },
);

AccountCompanyClinicLinkSchema.index({ companyId: 1, clinicId: 1, accountId: 1 });

const MAccountCompanyClinicLink = model<AccountCompanyClinicLink>(
  'AccountCompanyClinicLink',
  AccountCompanyClinicLinkSchema,
);

export default MAccountCompanyClinicLink;
