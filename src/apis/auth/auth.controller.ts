import { Response } from 'express';
import { Body, Controller, Get, HttpCode, Post, QueryParams, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Inject, Service as Injectable } from 'typedi';

import LoggerMixing from '@/common/base/logger-mixing';
import GenericResponse from '@/common/msg/generic-response';
import ValidationMiddleware from '@/middlewares/validation.middleware';

import AuthService from './auth.service';
import {
  RequestLogInByEmailDto,
  RequestRegisterByAptosDto,
  RequestRegisterByEmailDto,
  RequestRegisterBySolanaDto,
  RequestRegisterByWalletDto,
  RequestSignedByAptosDto,
  RequestSignedBySolanaDto,
  RequestSignedByWalletDto,
  RequestVerifyAddressQuery,
  RequestVerifyAptosQuery,
  RequestVerifySolanaQuery,
} from './dtos/auth.request';
import { ResponseRegisterDto, ResponseTokenDto, ResponseVerifyAddressDto } from './dtos/auth.response';

@Controller('/auth')
@Injectable()
class AuthController extends LoggerMixing {
  @Inject()
  service: AuthService;

  protected loggerName = 'AuthController';

  @Get('/wallet/status')
  @OpenAPI({ summary: 'Verify an address whether has been registered or not.' })
  @ResponseSchema(ResponseVerifyAddressDto)
  async walletStatus(@QueryParams() query: RequestVerifyAddressQuery): Promise<GenericResponse> {
    this.logger.info(`Verify address whether is registered or not: ${query.address}`);
    const [registered, nonce] = await this.service.verifyWallet(query.address);

    this.logger.info(`Returns: ${registered}`);
    return GenericResponse.success({ registered, nonce });
  }

  @Post('/wallet/register')
  @UseBefore(ValidationMiddleware(RequestRegisterByWalletDto, 'body'))
  @HttpCode(201)
  @OpenAPI({ summary: 'Register a new account by wallet' })
  @ResponseSchema(ResponseRegisterDto)
  async walletRegister(@Body() payload: RequestRegisterByWalletDto): Promise<GenericResponse> {
    this.logger.info(`Registering new account with wallet address: ${payload.address}.`);
    const { address, chainId, referralFrom } = payload;

    const user = await this.service.registerWithWallet(address, chainId, referralFrom);
    const data = ResponseRegisterDto.fromRaw(user);

    this.logger.info(`Returns: ${data}`);
    return GenericResponse.success(data);
  }

  @Post('/wallet/login')
  @UseBefore(ValidationMiddleware(RequestSignedByWalletDto, 'body'))
  @HttpCode(201)
  @OpenAPI({ summary: 'Log in an account by wallet' })
  @ResponseSchema(ResponseTokenDto)
  async walletLogin(@Body() payload: RequestSignedByWalletDto, @Res() res: Response): Promise<GenericResponse> {
    this.logger.info(`Log in with wallet address: ${payload.address}.`);
    const { address, signature } = payload;

    const [cookieData, tokenData] = await this.service.logInWithWallet(address, signature);
    const data = ResponseTokenDto.fromRaw(tokenData);

    this.logger.info(`Returns: ${data}`);
    res.setHeader('Set-Cookie', [cookieData]);
    return GenericResponse.success(data);
  }

  @Post('/register')
  @UseBefore(ValidationMiddleware(RequestRegisterByEmailDto, 'body'))
  @HttpCode(201)
  @OpenAPI({ summary: 'Register a new user with email' })
  @ResponseSchema(ResponseRegisterDto)
  async signUpWithEmail(@Body() payload: RequestRegisterByEmailDto): Promise<GenericResponse> {
    this.logger.info(`Registering new account with email: ${payload.email}.`);
    const { username, email, password, referralFrom } = payload;

    const user = await this.service.registerWithEmail(username, email, password, referralFrom);
    const data = ResponseRegisterDto.fromRaw(user);

    this.logger.info(`Returns: ${data}`);
    return GenericResponse.success(data);
  }

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

export default AuthController;
