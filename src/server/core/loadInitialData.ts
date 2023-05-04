import { Types } from 'mongoose';
import { PermKey, RoleKey } from '../mods/base/db/_types';
import {
  MAccount, MCompany, MClinic, MAccountCompanyLink, MAccountCompanyClinicLink,
} from '../mods/base/db';
import hashPassword from '../mods/base/utils/hashPassword';

export default async function loadInitialData() {
  const adminEmail = 'admin@test.com';

  const adminAccountDoc = await MAccount.findOne({ login: adminEmail });
  if (!adminAccountDoc) {
    const adminFirstName = 'James';
    const adminLastName = 'Guzman';
    const adminPwHash = await hashPassword('admin123');
    await new MAccount({
      email: adminEmail,
      login: adminEmail,
      password: adminPwHash,
      firstName: adminFirstName,
      lastName: adminLastName,
      name: `${adminFirstName} ${adminLastName}`,
      isEmailVerified: true,
      roles: [{ roleKey: RoleKey.admin, perms: [PermKey.superAdmin] }],
    }).save();
  }

  const companyId = new Types.ObjectId('642cdcf28c29433c456c9654');
  const companyName = 'Smile Dental Care, Inc.';
  const clinicId = new Types.ObjectId('642ced6833b7b1a2cba703c6');
  const clinicName = 'Smile Dental Care';
  const userAccountId = new Types.ObjectId('642cddbd8c29433c456c9655');
  const userFirstName = 'Miguel';
  const userLastName = 'Herrera';
  const userName = `${userFirstName} ${userLastName}`;
  const userEmail = 'user@test.com';

  const companyDoc = await MCompany.findOne({ _id: companyId });
  if (!companyDoc) {
    await new MCompany({
      _id: companyId,
      name: companyName,
      loginPrefix: 'smile',
      ownedById: userAccountId,
    }).save();
  }

  const clinicDoc = await MClinic.findOne({ _id: clinicId });
  if (!clinicDoc) {
    await new MClinic({
      _id: clinicId,
      name: clinicName,
      companyId,
    }).save();
  }

  const userAccountDoc = await MAccount.findOne({ login: userEmail });
  if (!userAccountDoc) {
    const userPwHash = await hashPassword('user123');
    await new MAccount({
      email: userEmail,
      login: userEmail,
      password: userPwHash,
      firstName: userFirstName,
      lastName: userLastName,
      name: userName,
      isEmailVerified: true,
      roles: [{ roleKey: RoleKey.user }],
    }).save();

    await new MAccountCompanyLink({
      account: { _id: userAccountId, name: userName },
      company: { _id: companyId, name: companyName },
    }).save();

    await new MAccountCompanyClinicLink({
      account: { _id: userAccountId, name: userName },
      company: { _id: companyId, name: companyName },
      clinic: { _id: clinicId, name: clinicName },
    }).save();
  }
}
