import { compare } from 'bcrypt';
import lodash from 'lodash';
import { UnauthorizedError } from 'routing-controllers';
import { Service as Injectable } from 'typedi';

import BaseService from '@/common/base/base-service';
import { CookieData, TokenData } from '@/common/interfaces/auth.interface';
import { UserEntity } from '@/entities/user.entity';
import { ErrorMessage } from '@/exceptions/ErrorMessage';
import { JWTUtil } from '@/utils/jwt.util';

@Injectable()
class AuthService extends BaseService {
  protected loggerName = 'AuthService';

  public async logInWithEmail(email: string, password: string): Promise<[CookieData, TokenData]> {
    const existing = await this.db.findOne(UserEntity, {
      where: { email },
      select: ['id', 'email', 'address', 'username', 'password', 'solana', 'aptos', 'chainId', 'uid', 'role'],
    });

    if (lodash.isNil(existing)) {
      this.logger.error(`Email ${email} not found.`);
      throw new UnauthorizedError(ErrorMessage.Auth_InvalidEmailPassword);
    }

    const passwordMatched = await compare(password, existing.password);
    if (!passwordMatched) {
      this.logger.error('Password not matched.');
      throw new UnauthorizedError(ErrorMessage.Auth_InvalidEmailPassword);
    }

    const tokenData = JWTUtil.createJWT(existing);
    const cookieData = JWTUtil.createCookie(tokenData);

    return [cookieData, tokenData];
  }
}

export default AuthService;
