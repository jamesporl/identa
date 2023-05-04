import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../../core/config';

export default function generateVerificationToken(accountId: Types.ObjectId) {
  const objToSign = { aid: accountId.toHexString() };
  return jwt.sign(objToSign, config.JWT_EMAIL_VER_SECRET, { expiresIn: '30d' });
}
