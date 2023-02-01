import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ResponseVerifyAddressDto {
  @IsBoolean()
  registered: boolean;

  @IsOptional()
  @IsString()
  nonce?: string;
}

export class ResponseRegisterDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  solanaPubkey?: string;

  @IsOptional()
  @IsString()
  aptosPubkey?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  nonce?: string;

  static fromRaw(raw: any): ResponseRegisterDto {
    return {
      address: raw.address,
      solanaPubkey: raw.solana,
      aptosPubkey: raw.aptos,
      message: raw.nonce && 'Hi, Dotties!',
      email: raw.email,
      nonce: raw.nonce,
    } as ResponseRegisterDto;
  }
}

export class ResponseTokenDto {
  @IsString()
  public token: string;

  @IsString()
  public expiresIn: number;

  static fromRaw(raw: any): ResponseTokenDto {
    return {
      token: raw.token,
      expiresIn: raw.expiresIn,
    } as ResponseTokenDto;
  }
}

export class ResponseLogOutDto {
  @IsBoolean()
  logout: boolean;
}
