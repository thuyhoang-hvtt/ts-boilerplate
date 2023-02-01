import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import CacheManager, { CacheManagerOptions } from '@type-cacheable/core';
import { useAdapter } from '@type-cacheable/ioredis-adapter';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import * as http from 'http';
import IORedis from 'ioredis';
import { merge } from 'lodash';
import morgan from 'morgan';
import passport from 'passport';
import 'reflect-metadata';
import {
  getMetadataArgsStorage,
  HttpError,
  useExpressServer,
  useContainer as useRoutingContainer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { SocketControllers } from 'socket-controllers';
import * as socketio from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import Container from 'typedi';
import { createConnection } from 'typeorm';

import { AppInterface } from '@/common/interfaces/app.interface';
import {
  __ROOT_DIR__,
  EnvironmentConfig,
  GCSConfig,
  LogConfig,
  RedisConfig,
  SendgridConfig,
  SentryConfig,
} from '@/config';
import ErrorMiddleware from '@/middlewares/error.middleware';

import LoggerMixing from './common/base/logger-mixing';
import DiscordBot from './common/discord/client';
import GCStorage from './common/gcs/client';
import DiscordStrategy from './common/passport/discord';
import SendgridClient from './common/sendgrid/client';
import Telebot from './common/telegram/client';
import dbConnection from './db';

class App extends LoggerMixing {
  public app: express.Application;
  public io: socketio.Server;
  public env: string;
  public port: string | number;
  protected loggerName = 'ROOT';

  constructor(options: AppInterface) {
    super();
    this.app = express();
    this.env = EnvironmentConfig.NODE_ENV || 'development';
    this.port = EnvironmentConfig.PORT || 3000;

    this.connectToDatabase();
    this.connectToRedis();
    // this.initializePassport();
    this.initializeTypeDI();
    // this.initializeSentry();
    this.initializeMiddlewares();
    this.initializeRoutes(options.controllers);
    this.initializeSockets(options.wss);
    this.initializeSwagger(options.controllers);
    this.initializeErrorHandling();
    this.initializeHome();
    // this.initializeSendgrid();
    // this.initializeStorage();
    // this.initializeDiscordBot();
    // this.initializeTelegramBot();
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info('=================================');
      this.logger.info(`======= ENV: ${this.env} =======`);
      this.logger.info(`🚀 App listening on the port ${this.port}`);
      this.logger.info('=================================');
    });
  }

  public initializeHome() {
    this.app.get('/', (_, response) => response.send('OK'));
  }

  private initializeSendgrid() {
    SendgridClient.init({
      apiKey: SendgridConfig.SG_APIKEY,
      from: SendgridConfig.SG_ORGANIZATION_EMAIL,
    });
  }

  private initializeDiscordBot() {
    DiscordBot.init();
  }

  private initializeTelegramBot() {
    Telebot.init();
  }

  private initializeStorage() {
    GCStorage.init({
      keyFilename: GCSConfig.GCS_KEY_PATH,
      projectId: GCSConfig.GCS_PROJECT_ID,
    });
  }

  private initializePassport() {
    passport.use(DiscordStrategy);
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    this.app.use(passport.initialize());
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    createConnection(dbConnection);
  }

  private connectToRedis() {
    const client = new IORedis({
      host: RedisConfig.REDIS_HOST,
      port: RedisConfig.REDIS_PORT,
      password: RedisConfig.REDIS_PASSWORD,
    });
    useAdapter(client);
    CacheManager.setOptions({
      ttlSeconds: RedisConfig.REDIS_GLOBAL_TTL,
    } as CacheManagerOptions);
  }

  private initializeMiddlewares() {
    this.app.use(
      morgan(LogConfig.LOG_FORMAT, {
        stream: {
          write: (message: string) => {
            this.logger.info(message.substring(0, message.lastIndexOf('\n')));
          },
        },
      }),
    );
    this.app.use(cors({ origin: EnvironmentConfig.CORS_ORIGIN, credentials: EnvironmentConfig.CORS_CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeTypeDI() {
    useRoutingContainer(Container);
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      routePrefix: EnvironmentConfig.API_PREFIX,
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSockets(controllers: Function[]) {
    this.io = new socketio.Server(http.createServer(this.app), {
      cors: {
        origin: '',
      },
    });
    // useSocketServer(this.io, {
    //   controllers: controllers,
    // });
    new SocketControllers({
      io: this.io,
      container: Container,
      controllers: controllers,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    }) as any;

    const routingControllersOptions = {
      routePrefix: EnvironmentConfig.API_PREFIX,
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: '<INPUT HERE>',
        version: '1.0.0',
      },
    });

    // Use relative path here because it cannot be compiled by tsc
    const overrideSwagger = require('./docs/override_swagger.json');
    merge(spec, overrideSwagger);

    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeSentry() {
    Sentry.init({
      dsn: SentryConfig.SENTRY_DNS,
      environment: EnvironmentConfig.NODE_ENV,
      integrations: [
        new RewriteFrames({
          root: __ROOT_DIR__,
        }),
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: false }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: this.app }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      beforeSend: (event, hint) => {
        if (event.environment === 'development') return null;
        const error = hint.originalException as HttpError;
        if (error && error.httpCode !== 500) {
          return null;
        }
        return event;
      },
    });

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    this.app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler());
  }

  private initializeErrorHandling() {
    this.app.use(Sentry.Handlers.errorHandler());
    this.app.use(ErrorMiddleware);
  }
}

export default App;
