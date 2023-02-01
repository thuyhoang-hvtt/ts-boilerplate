import { config } from 'dotenv';
import path from 'path';

config({ path: '.env' });

export const __ROOT_DIR__ = path.resolve(__dirname, '..', '..');

export const DatabaseConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_LOGGING: process.env.DB_LOGGING === 'true',
};

export const EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT ?? '7749'),
  ADMIN_PORT: parseInt(process.env.ADMIN_PORT ?? '7070'),
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  API_PREFIX: process.env.API_PREFIX ?? '/api',
  ROOT_URL: process.env.ROOT_URL ?? 'http://localhost:7749',
};

export const LogConfig = {
  LOG_FORMAT: process.env.LOG_FORMAT ?? 'dev',
  LOG_DIR: process.env.LOG_DIR ?? 'logs',
};

export const RedisConfig = {
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_GLOBAL_TTL: parseInt(process.env.REDIS_GLOBAL_TTL ?? '3600'),
};

export const SentryConfig = {
  SENTRY_DNS: process.env.SENTRY_DNS,
};

export const JwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION ?? '3600'),
  JWT_ISSUER: process.env.JWT_ISSUER ?? 'https://dotties.io',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? 'JWT_APIs',
};

export const SendgridConfig = {
  SG_APIKEY: process.env.SG_APIKEY,
  SG_ORGANIZATION_EMAIL: process.env.SG_ORGANIZATION_EMAIL ?? 'dotties.io',
};

export const ServerWalletConfig = {
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CHAIN_ID: process.env.CHAIN_ID,
};

export const WhiteListDistribute = {
  DISTRIBUTE_CONTRACT: process.env.DISTRIBUTE_CONTRACT,
  DISTRIBUTE_SIGNING_DOMAIN: process.env.DISTRIBUTE_SIGNING_DOMAIN,
  SIGNATURE_VERSION: process.env.SIGNATURE_VERSION,
  CHAIN_ID: process.env.CHAIN_ID,
};

export const GCSConfig = {
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID,
  GCS_KEY_PATH: process.env.GCS_KEY_PATH,
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
};

export const UploadFileConfig = {
  LIMIT_FILE_SIZE: 1024 * 1024 * 2,
  LIMIT_FILE_NAME: 255,
};

export const OAuthGoogleConfig = {
  OA_GOOGLE_ID: process.env.OA_GOOGLE_ID,
  OA_GOOGLE_SECRET: process.env.OA_GOOGLE_SECRET,
  OA_GOOGLE_CALLBACK: process.env.OA_GOOGLE_CALLBACK,
};

export const OAuthDiscordConfig = {
  OA_DISCORD_ID: process.env.OA_DISCORD_ID,
  OA_DISCORD_SECRET: process.env.OA_DISCORD_SECRET,
  OA_DISCORD_CALLBACK: process.env.OA_DISCORD_CALLBACK,
  OA_DISCORD_SCOPE: ['identify', 'email', 'guilds', 'guilds.join'],
  OA_DISCORD_SUCCESS_URL: process.env.OA_DISCORD_SUCCESS_URL,
};

export const DiscordBotConfig = {
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
};

export const TelegramBotConfig = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_BOT_POOLING: process.env.TELEGRAM_BOT_POOLING === 'true',
};
