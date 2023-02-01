import * as Sentry from '@sentry/node';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import 'reflect-metadata';
import { getMetadataArgsStorage, useContainer as rcUseContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import Container from 'typedi';
import { createConnection } from 'typeorm';

import { AppInterface } from '@/common/interfaces/app.interface';
import { __ROOT_DIR__, EnvironmentConfig, LogConfig } from '@/config';
import ErrorMiddleware from '@/middlewares/error.middleware';

import LoggerMixing from './common/base/logger-mixing';
import dbConnection from './db';

class Admin extends LoggerMixing {
  public app: express.Application;
  public env: string;
  public port: string | number;
  protected loggerName = 'ROOT';

  constructor(options: AppInterface) {
    super();
    this.app = express();
    this.env = EnvironmentConfig.NODE_ENV || 'development';
    this.port = EnvironmentConfig.ADMIN_PORT || 3001;

    this.connectToDatabase();
    this.initializeTypeDI();
    this.initializeMiddlewares();
    this.initializeRoutes(options.controllers);
    this.initializeSwagger(options.controllers);
    this.initializeErrorHandling();
    this.initializeHome();
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info('=================================');
      this.logger.info(`======= ENV: ${this.env} =======`);
      this.logger.info(`🚀 Admin listening on the port ${this.port}`);
      this.logger.info('=================================');
    });
  }

  public initializeHome() {
    this.app.get('/', (_, response) => response.send('OK'));
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    createConnection(dbConnection);
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
    rcUseContainer(Container);
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      routePrefix: '',
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    }) as any;

    const routingControllersOptions = {
      routePrefix: '',
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

    this.app.use('/admin', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(Sentry.Handlers.errorHandler());
    this.app.use(ErrorMiddleware);
  }
}

export default Admin;
