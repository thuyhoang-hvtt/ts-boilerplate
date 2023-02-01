import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export interface SGConfig {
  from: string;
  apiKey: string;
  replyTo?: string;
}

export interface SendPayload {
  to: {
    email: string;
    name?: string;
  };
  data: SGData;
  template: SGTemplate;
  subject: string;
  attachments?: any[];
}

export enum SGTemplate {
  EmailVerification = 'SG_EMAIL_VERIFICATION_ID',
  ConfirmationCode = 'SG_CONFIRMATION_CODE_ID',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SGData {}

export class SGEmailVerificationData implements SGData {
  @IsAlphanumeric()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsUrl()
  verification_url: string;
}

export class SGConfirmationCodeData implements SGData {
  @IsAlphanumeric()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsString()
  confirmation_code: string;

  @IsNotEmpty()
  @IsString()
  code_ttl: number;
}
