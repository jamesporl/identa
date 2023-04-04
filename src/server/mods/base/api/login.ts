import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../core/trpc';
import { MAccount } from '../db';
import generateAuthToken from '../utils/generateAuthToken';

const login = publicProcedure.input(
  z.object({
    login: z.string(),
    password: z.string(),
  }),
)
  .mutation(async ({ input }) => {
    const { password, login: inputLogin } = input;
    const account = await MAccount.findOne({ login: inputLogin, isActive: true }).lean();

    if (!account) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid credentials.',
      });
    }

    const isMatched = await bcrypt.compare(password, account.password);
    if (!isMatched) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid credentials.',
      });
    }

    let authToken = '';
    try {
      authToken = generateAuthToken(account);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Unable to generate auth token',
      });
    }

    return authToken;
  });

export default login;
