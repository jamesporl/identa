import { Types } from 'mongoose';
import { MAccount, MAccountEmailVerCode } from '../db';
import validateEmailByRegex from './validateEmailByRegex';
import generateSixDigitCode from './generateSixDigitCode';

export default async function sendWelcomeWithVerificationCodeEmail(accountId: Types.ObjectId) {
  const account = await MAccount.findOne({ _id: accountId });
  if (validateEmailByRegex(account?.login || '')) {
    throw new Error('Account does log in by email.');
  }

  const code = generateSixDigitCode();

  await MAccountEmailVerCode.updateOne(
    { accountId },
    { $set: { code, sentAt: new Date(), attempts: 0 } },
    { upsert: true },
  );

  console.log(`verification code for ${account?.login} is ${code}`);
}
