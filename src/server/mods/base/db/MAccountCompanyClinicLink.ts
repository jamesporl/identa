import { model, Schema } from 'mongoose';
import { SimpleAccountSchema, SimpleCompanySchema } from './MAccountCompanyLink';
import { AccountCompanyClinicLink } from './_types';

export const SimpleClinicSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
);

const AccountCompanyClinicLinkSchema = new Schema(
  {
    company: SimpleCompanySchema,
    account: SimpleAccountSchema,
    clinic: SimpleClinicSchema,
  },
  { collection: 'AccountCompanyLink', timestamps: true },
);

AccountCompanyClinicLinkSchema.index({ 'clinic._id': 1 });
AccountCompanyClinicLinkSchema.index({ 'account._id': 1 });

const MAccountCompanyClinicLink = model<AccountCompanyClinicLink>(
  'AccountCompanyClinicLink',
  AccountCompanyClinicLinkSchema,
);

export default MAccountCompanyClinicLink;
