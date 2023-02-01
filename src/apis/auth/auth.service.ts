import { compare, hash } from 'bcrypt';
import lodash from 'lodash';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { Service as Injectable } from 'typedi';

import BaseService from '@/common/base/base-service';
import { CookieData, TokenData } from '@/common/interfaces/auth.interface';
import { UserEntity } from '@/entities/user.entity';
import { User } from '@/entities/user.interface';
import { UserReferralEntity } from '@/entities/userreferral.entity';
import { UserReferral } from '@/entities/userreferral.interface';
import { ErrorMessage } from '@/exceptions/ErrorMessage';
import { JWTUtil } from '@/utils/jwt.util';
import { RandomUtil } from '@/utils/random.util';
import Web3Util from '@/utils/web3.util';

@Injectable()
class AuthService extends BaseService {
  protected loggerName = 'AuthService';

  async verifyWallet(address: string): Promise<[boolean, string]> {
    const existing = await this.db.findOne(UserEntity, { where: { address } });
    return [!lodash.isNil(existing), existing?.nonce];
  }

  async verifySolanaPubkey(publicKey: string): Promise<[boolean, string]> {
    const existing = await this.db.findOne(UserEntity, { where: { solana: publicKey } });
    return [!lodash.isNil(existing), existing?.nonce];
  }

  async verifyAptosPubkey(account: string): Promise<[boolean, string]> {
    const existing = await this.db.findOne(UserEntity, { where: { aptos: account } });
    return [!lodash.isNil(existing), existing?.nonce];
  }

  async registerWithWallet(address: string, chainId?: number, referralFrom?: string): Promise<User> {
    const existing = await this.db.findOne(UserEntity, { where: { address } });

    if (!lodash.isNil(existing)) {
      this.logger.error(`Address '${address}' already exists.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressAlreadyRegistered);
    }

    const user = await this.db.save(UserEntity, {
      address,
      chainId,
      nonce: RandomUtil.generateArbitraryNumber(),
      uid: RandomUtil.generateUUID(),
    });

    await this._createReferralEntry(user.id, referralFrom);

    return user;
  }

  public async logInWithWallet(address: string, signature: string): Promise<[CookieData, TokenData]> {
    const existing = await this.db.findOne(UserEntity, {
      where: { address },
      select: ['id', 'email', 'address', 'solana', 'username', 'chainId', 'uid', 'role', 'nonce'],
    });

    if (lodash.isNil(existing)) {
      this.logger.error(`User with address '${address}' not found.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressNotFound);
    }

    if (!Web3Util.verifyEthereumSignature(existing.nonce, signature, existing.address)) {
      this.logger.error('Given signature encrypted wrong nonce.');
      throw new BadRequestError(ErrorMessage.Auth_InvalidNonce);
    }

    const tokenData = JWTUtil.createJWT(existing);
    const cookieData = JWTUtil.createCookie(tokenData);

    this.logger.info(`Generate new nonce for user: ${existing.id}`);
    existing.nonce = RandomUtil.generateArbitraryNumber();
    await existing.save();

    return [cookieData, tokenData];
  }

  async registerWithSolana(pubkey: string, referralFrom?: string): Promise<User> {
    const existing = await this.db.findOne(UserEntity, { where: { solana: pubkey } });

    if (!lodash.isNil(existing)) {
      this.logger.error(`Address '${pubkey}' already exists.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressAlreadyRegistered);
    }

    const user = await this.db.save(UserEntity, {
      solana: pubkey,
      nonce: RandomUtil.generateArbitraryNumber(),
      uid: RandomUtil.generateUUID(),
    });

    await this._createReferralEntry(user.id, referralFrom);

    return user;
  }

  async registerWithAptos(account: string, referralFrom?: string): Promise<User> {
    const existing = await this.db.findOne(UserEntity, { where: { aptos: account } });

    if (!lodash.isNil(existing)) {
      this.logger.error(`Address '${account}' already exists.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressAlreadyRegistered);
    }

    const user = await this.db.save(UserEntity, {
      aptos: account,
      nonce: RandomUtil.generateArbitraryNumber(),
      uid: RandomUtil.generateUUID(),
    });

    await this._createReferralEntry(user.id, referralFrom);

    return user;
  }

  public async logInWithSolana(pubkey: string, signature: string): Promise<[CookieData, TokenData]> {
    const existing = await this.db.findOne(UserEntity, {
      where: { solana: pubkey },
      select: ['id', 'email', 'address', 'username', 'solana', 'aptos', 'chainId', 'uid', 'role', 'nonce'],
    });

    if (lodash.isNil(existing)) {
      this.logger.error(`User with address '${pubkey}' not found.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressNotFound);
    }

    if (!Web3Util.verifySolanaSignature(existing.nonce, signature, pubkey)) {
      this.logger.error(`Given signature encrypted wrong nonce ${existing.nonce}.`);
      throw new BadRequestError(ErrorMessage.Auth_InvalidNonce);
    }

    const tokenData = JWTUtil.createJWT(existing);
    const cookieData = JWTUtil.createCookie(tokenData);

    this.logger.info(`Generate new nonce for user: ${existing.id}`);
    existing.nonce = RandomUtil.generateArbitraryNumber();
    await existing.save();

    return [cookieData, tokenData];
  }

  public async logInWithAptos(account: string, pubkey: string, signature: string): Promise<[CookieData, TokenData]> {
    const existing = await this.db.findOne(UserEntity, {
      where: { aptos: account },
      select: ['id', 'email', 'address', 'username', 'solana', 'aptos', 'chainId', 'uid', 'role', 'nonce'],
    });

    if (lodash.isNil(existing)) {
      this.logger.error(`User with address '${account}' not found.`);
      throw new BadRequestError(ErrorMessage.Auth_AddressNotFound);
    }

    const aptosMessageI = `APTOS\nmessage: Hi, Dotties!\nnonce: ${existing.nonce}`;
    const aptosMessageII = `APTOS\nnonce: ${existing.nonce}\nmessage: Hi, Dotties!`;
    if (
      !Web3Util.verifyAptosSignature(aptosMessageI, signature, pubkey) &&
      !Web3Util.verifyAptosSignature(aptosMessageII, signature, pubkey)
    ) {
      this.logger.error(`Given signature encrypted wrong nonce ${existing.nonce}.`);
      throw new BadRequestError(ErrorMessage.Auth_InvalidNonce);
    }

    const tokenData = JWTUtil.createJWT(existing);
    const cookieData = JWTUtil.createCookie(tokenData);

    this.logger.info(`Generate new nonce for user: ${existing.id}`);
    existing.nonce = RandomUtil.generateArbitraryNumber();
    await existing.save();

    return [cookieData, tokenData];
  }

  public async registerWithEmail(
    username: string,
    email: string,
    password: string,
    referralFrom: string,
  ): Promise<User> {
    const existing = await this.db.findOne(UserEntity, { where: { email } });
    if (!lodash.isNil(existing)) {
      throw new BadRequestError(ErrorMessage.Auth_EmailAlreadyRegistered);
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.db.save(UserEntity, {
      username,
      email,
      password: hashedPassword,
      nonce: RandomUtil.generateArbitraryNumber(),
      uid: RandomUtil.generateUUID(),
    });

    await this._createReferralEntry(user.id, referralFrom);

    return user;
  }

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

  async _createReferralEntry(userId: string, referralFrom: string = null): Promise<UserReferral> {
    return this.db.save(UserReferralEntity, {
      userId,
      referralCode: RandomUtil.generateAlphanumeric(8).toUpperCase(),
      referralFrom: referralFrom,
    });
  }
}

export default AuthService;
