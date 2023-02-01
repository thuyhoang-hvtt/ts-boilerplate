import { Request } from 'express';

import { User } from '@/entities/user.interface';

export interface DataStoredInToken extends Partial<User> {
  id: string;
  email?: string;
  address?: string;
  solana?: string;
  username?: string;
  chainId?: number;
  uid?: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export type CookieData = string;

export interface RequestContext {
  user?: User;
  [key: string]: any;
}
export interface RequestWithContext extends Request {
  context: RequestContext;
}

export enum RoleEnum {
  Admin = 'Admin',
  Manager = 'Manager',
  EndUser = 'EndUser',
}
