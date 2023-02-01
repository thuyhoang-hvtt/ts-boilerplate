import winston from 'winston';

// Define log format
export const timestampFormat = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

export const colorizeFormat = winston.format.colorize({ level: true });

export const logFormat = winston.format.printf(
  ({ timestamp, level, message, context = 'ROOT' }) => `${timestamp} ${level}: [${context}] ${message}`,
);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
export const logger = winston.createLogger({
  format: winston.format.combine(timestampFormat, logFormat),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), colorizeFormat),
    }),
  ],
});
