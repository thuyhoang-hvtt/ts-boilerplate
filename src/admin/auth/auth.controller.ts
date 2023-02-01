import { Response } from 'express';
import { Body, Controller, Post, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Inject, Service as Injectable } from 'typedi';

import LoggerMixing from '@/common/base/logger-mixing';
import GenericResponse from '@/common/msg/generic-response';
import ValidationMiddleware from '@/middlewares/validation.middleware';

import AuthService from './auth.service';
import { RequestLogInByEmailDto } from './dtos/auth.request';
import { ResponseTokenDto } from './dtos/auth.response';

@Controller('/auth')
@Injectable()
class AuthAdminController extends LoggerMixing {
  @Inject()
  service: AuthService;

  protected loggerName = 'AuthAdminController';

  @Post('/login')
  @UseBefore(ValidationMiddleware(RequestLogInByEmailDto, 'body'))
  @OpenAPI({ summary: 'Log an existing user in' })
  @ResponseSchema(ResponseTokenDto)
  async logIn(@Res() res: Response, @Body() payload: RequestLogInByEmailDto) {
    this.logger.info(`Log in an account with email: ${payload.email}.`);
    const { email, password } = payload;

    const [cookieData, tokenData] = await this.service.logInWithEmail(email, password);
    const data = ResponseTokenDto.fromRaw(tokenData);

    this.logger.info(`Returns: ${data}`);
    res.setHeader('Set-Cookie', [cookieData]);
    return GenericResponse.success(data);
  }
}

export default AuthAdminController;
