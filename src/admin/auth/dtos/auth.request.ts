import { IsEmail, IsString } from 'class-validator';

export class RequestLogInByEmailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
