import { IsEmail, IsEthereumAddress, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

import { IsAptosAddress, IsSolanaAddress, IsUsername } from '@/common/validators';

export class RequestVerifyAddressQuery {
  @IsEthereumAddress()
  public address: string;
}
export class RequestRegisterByWalletDto {
  @IsEthereumAddress()
  public address: string;

  @IsOptional()
  @IsPositive()
  public chainId?: number;

  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'Referral code must be length of 8' })
  public referralFrom?: string;
}

export class RequestSignedByWalletDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class RequestVerifySolanaQuery {
  @IsSolanaAddress()
  public pubkey: string;
}

export class RequestRegisterBySolanaDto {
  @IsSolanaAddress()
  public pubkey: string;

  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'Referral code must be length of 8' })
  public referralFrom?: string;
}

export class RequestSignedBySolanaDto {
  @IsNotEmpty()
  @IsSolanaAddress()
  pubkey: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class RequestVerifyAptosQuery {
  @IsAptosAddress()
  public account: string;
}

export class RequestRegisterByAptosDto {
  @IsAptosAddress()
  public account: string;

  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'Referral code must be length of 8' })
  public referralFrom?: string;
}

export class RequestSignedByAptosDto {
  @IsNotEmpty()
  @IsAptosAddress()
  account: string;

  @IsNotEmpty()
  @IsAptosAddress()
  pubkey: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class RequestRegisterByEmailDto {
  @IsUsername()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public confirmPassword: string;

  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'Referral code must be length of 8' })
  public referralFrom?: string;
}

export class RequestLogInByEmailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
