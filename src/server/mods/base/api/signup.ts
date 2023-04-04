import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import { publicProcedure } from '../../../core/trpc';
import { MAccount } from '../db';
import generateAuthToken from '../utils/generateAuthToken';
import hashPassword from '../utils/hashPassword';
import { RoleKey } from '../db/_types';

const signup = publicProcedure.input(
  z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid em-mail'),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    password: z.string(),
  }),
)
  .mutation(async ({ input }) => {
    const {
      email, firstName, lastName, password,
    } = input;
    const emailExists = !!(await MAccount.findOne({ email }));
    if (emailExists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'E-mail is already taken.',
      });
    }

    // todo: check password strength

    const hashedPw = await hashPassword(password);

    const newId = new Types.ObjectId();
    const newAccount = await new MAccount({
      _id: newId,
      firstName,
      lastName,
      email,
      login: email,
      password: hashedPw,
      roles: [{ key: RoleKey.user, perms: [] }],
      createdById: newId,
      updatedById: newId,
    }).save();

    const authToken = generateAuthToken(newAccount);
    return authToken;
  });

export default signup;
