import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger.util';

const ErrorMiddleware = (exception: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = exception.httpCode || 500;
    const message: string = exception.message || 'Something went wrong';
    const details = exception.errors;

    logger.error(`Error trace: \n${exception.stack}`);
    res.status(status).json({ success: false, message, details });
  } catch (error) {
    next(error);
  }
};

export default ErrorMiddleware;
