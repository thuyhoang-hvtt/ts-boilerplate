import { HttpError } from 'routing-controllers';

export class HttpException extends HttpError {
  public message: string;
  public errors: unknown[];

  constructor(httpCode: number, message: string) {
    super(httpCode, message);
    this.message = message;
  }
}
