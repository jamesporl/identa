import { model, Schema, Types } from 'mongoose';
import { Account, PERM_KEY_VALUES, ROLE_KEY_VALUES } from './_types';

// todo: remove _id
const AccountRoleSchema = new Schema(
  {
    roleKey: { type: String, enum: ROLE_KEY_VALUES, required: true },
    perms: [{ type: [String], enum: PERM_KEY_VALUES }],
  },
  {
    _id: false,
  },
);

const AccountSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true },
    login: {
      type: String, trim: true, lowercase: true, unique: true,
    },
    username: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isEmailValidated: { type: Boolean, default: true },
    password: String,
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    roles: [AccountRoleSchema],
    phone: { type: String },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Account', timestamps: true },
);

AccountSchema.index({ login: 1 });

const MAccount = model<Account>('Account', AccountSchema);

export default MAccount;
