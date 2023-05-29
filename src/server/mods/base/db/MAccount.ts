import { model, Schema, Types } from 'mongoose';
import { Account } from './_types';

/*
  If isAdmin, name, image, phone, and title should be maintained in this collection
  If not isAdmin, name, title, phone and image will be from the latest CompanyAccountLink item,
*/
const AccountSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true },
    login: {
      type: String, trim: true, lowercase: true, unique: true,
    },
    username: { type: String, trim: true },
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true },
    title: { type: String, trim: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: true },
    password: String,
    isAdmin: { type: Boolean, default: false },
    lastUsedCompanyId: { type: Types.ObjectId },
    lastUsedClinicId: { type: Types.ObjectId },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Account', timestamps: true },
);

AccountSchema.index({ login: 1 });

const MAccount = model<Account>('Account', AccountSchema);

export default MAccount;
