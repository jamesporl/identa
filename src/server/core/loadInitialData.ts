import { PermKey, RoleKey } from '../mods/base/db/_types';
import { MAccount } from '../mods/base/db';
import hashPassword from '../mods/base/utils/hashPassword';

export default async function loadInitialData() {
  const adminPwHash = await hashPassword('admin123');
  const adminEmail = 'admin@test.com';

  const adminPartner = {
    email: adminEmail,
    login: adminEmail,
    password: adminPwHash,
    firstName: 'Juan',
    lastName: 'Guzman',
    isEmailValidated: true,
    roles: [{ roleKey: RoleKey.admin, perms: [PermKey.superAdmin] }],
  };

  const adminAccountDoc = await MAccount.findOne({ email: adminEmail });
  if (!adminAccountDoc) {
    await new MAccount(adminPartner).save();
  }
}
