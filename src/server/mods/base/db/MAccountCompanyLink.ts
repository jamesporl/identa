import { model, Schema, Types } from 'mongoose';
import { AccountCompanyLink, COMPANY_PERM_KEY_VALUES } from './_types';

const AccountCompanyLinkSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true },
    accountId: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    isPractitioner: { type: Boolean, default: false },
    title: { type: String, trim: true },
    phone: { type: String, trim: true },
    hexColor: { type: String },
    image: { type: String },
    perms: [{ type: [String], enum: COMPANY_PERM_KEY_VALUES }],
    isActive: { type: Boolean, default: true },
  },
  { collection: 'AccountCompanyLink', timestamps: true },
);

AccountCompanyLinkSchema.index({ companyId: 1, accountId: 1 });

const MAccountCompanyLink = model<AccountCompanyLink>(
  'AccountCompanyLink',
  AccountCompanyLinkSchema,
);

export default MAccountCompanyLink;
