import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../core/trpc';
import config from '../../../core/config';
import { MAccount, MAccountEmailVerCode } from '../db';
import generateAuthToken from '../utils/generateAuthToken';

const verifyEmailByCode = publicProcedure.input(
  z.object({
    code: z.string(),
    verToken: z.string(),
  }),
)
  .mutation(async ({ input }) => {
    const { code, verToken } = input;

    const { aid } = jwt.verify(verToken, config.JWT_EMAIL_VER_SECRET) as { aid: string };

    // no need for expiration of verification token since code has an expiration logic already

    const account = await MAccount.findOne({ _id: aid }).lean();

    if (!account) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid verification token',
      });
    }

    if (account.isEmailVerified) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email is already verified',
      });
    }

    const verCodeDoc = await MAccountEmailVerCode.findOne({ accountId: account._id });
    if (!verCodeDoc) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Code not found.',
      });
    }

    if (verCodeDoc.attempts > 5) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Too many attempts, kindly request for a new verification code',
      });
    }

    if (verCodeDoc.code !== code) {
      await MAccountEmailVerCode.updateOne({ accountId: account._id }, { $inc: { attempts: 1 } });
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid code',
      });
    }

    const updatedAccount = await MAccount.findOneAndUpdate(
      { _id: account._id },
      { $set: { isEmailVerified: true } },
      { new: true },
    );

    let authToken = '';
    if (updatedAccount) {
      authToken = await generateAuthToken({ account: updatedAccount });
    }

    return { authToken };
  });

export default verifyEmailByCode;
