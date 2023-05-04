import { model, Schema } from 'mongoose';
import { AccountCompanyLink } from './_types';

export const SimpleAccountSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
);

export const SimpleCompanySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
);

const AccountCompanyLinkSchema = new Schema(
  {
    company: SimpleCompanySchema,
    account: SimpleAccountSchema,
  },
  { collection: 'AccountCompanyLink', timestamps: true },
);

AccountCompanyLinkSchema.index({ 'company._id': 1 });
AccountCompanyLinkSchema.index({ 'account._id': 1 });

const MAccountCompanyLink = model<AccountCompanyLink>(
  'AccountCompanyLink',
  AccountCompanyLinkSchema,
);

export default MAccountCompanyLink;
