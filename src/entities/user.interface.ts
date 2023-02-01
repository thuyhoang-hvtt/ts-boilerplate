import { RoleEnum } from '@/common/interfaces/auth.interface';

import { UserReferral } from './userreferral.interface';
import { UserSocial } from './usersocial.interface';

export interface User {
  id: string;
  email?: string;
  emailVerified?: boolean;
  password?: string;
  username?: string;
  address?: string;
  solana?: string;
  aptos?: string;
  chainId?: number;
  avatar?: string;
  nonce?: string;
  uid?: string;
  role?: RoleEnum;

  referral?: UserReferral;
  social?: UserSocial;
}
