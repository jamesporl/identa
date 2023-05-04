import { model, Schema, Types } from 'mongoose';
import { AccountEmailVerCode } from './_types';

const AccountEmailVerCodeSchema = new Schema(
  {
    accountId: { type: Types.ObjectId, required: true },
    code: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, required: true },
  },
  { collection: 'AccountEmailVerCode' },
);

AccountEmailVerCodeSchema.index({ accountId: 1 }, { unique: true });
AccountEmailVerCodeSchema.index({ sentAt: 1 }, { expireAfterSeconds: 60 * 60 });

const MAccountEmailVerCode = model<AccountEmailVerCode>(
  'AccountEmailVerCode',
  AccountEmailVerCodeSchema,
);

export default MAccountEmailVerCode;
