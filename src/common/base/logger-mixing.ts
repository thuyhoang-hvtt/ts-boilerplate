import winston, { createLogger, Logger } from 'winston';

import { colorizeFormat, logFormat, timestampFormat } from '@/utils/logger.util';

export default abstract class LoggerMixing {
  protected logger: Logger;
  protected loggerName: string;

  constructor() {
    const contextFormat = winston.format(metadata => Object.assign(metadata, { context: this.loggerName }))();
    this.logger = createLogger({
      format: winston.format.combine(contextFormat, timestampFormat, colorizeFormat, logFormat),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.splat()),
        }),
      ],
    });
  }
}
