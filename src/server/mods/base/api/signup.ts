import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import zxcbn from 'zxcvbn';
import { publicProcedure } from '../../../core/trpc';
import { MAccount } from '../db';
import hashPassword from '../utils/hashPassword';
import sendWelcomeWithVerificationCodeEmail from '../utils/sendEmailVerificationCode';
import generateVerificationToken from '../utils/generateVerificationToken';

const signup = publicProcedure.input(
  z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid em-mail'),
    password: z.string(),
  }),
)
  .mutation(async ({ input }) => {
    const { email, password } = input;
    const emailExists = !!(await MAccount.findOne({ email }));
    if (emailExists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'E-mail is already taken',
      });
    }

    const pwStrength = zxcbn(password);
    if (pwStrength.score < 2) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please set a stronger password',
      });
    }

    const hashedPw = await hashPassword(password);

    const newId = new Types.ObjectId();

    await new MAccount({
      _id: newId,
      name: email.split('@')[0],
      email,
      login: email,
      password: hashedPw,
      isEmailVerified: false,
      createdById: newId,
      updatedById: newId,
    }).save();

    const verificationToken = generateVerificationToken(newId);

    await sendWelcomeWithVerificationCodeEmail(newId);

    return { verificationToken };
  });

export default signup;
