import { sign } from 'jsonwebtoken';
import lodash from 'lodash';

import { CookieData, DataStoredInToken, TokenData } from '@/common/interfaces/auth.interface';
import { JwtConfig } from '@/config';

export class JWTUtil {
  static createJWT(data: DataStoredInToken): TokenData {
    const token = sign(
      lodash.pick(data, ['id', 'email', 'address', 'solana', 'username', 'uid', 'role']),
      JwtConfig.JWT_SECRET,
      {
        expiresIn: JwtConfig.JWT_EXPIRATION,
        notBefore: 0,
        audience: JwtConfig.JWT_AUDIENCE,
        issuer: JwtConfig.JWT_ISSUER,
      },
    );

    return { token, expiresIn: JwtConfig.JWT_EXPIRATION } as TokenData;
  }

  static createCookie(tokenData: TokenData): CookieData {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
