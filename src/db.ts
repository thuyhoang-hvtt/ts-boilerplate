import path from 'path';
import { ConnectionOptions } from 'typeorm';

import { DatabaseConfig } from '@/config';

const dbConnection = {
  type: 'mysql',
  host: DatabaseConfig.DB_HOST,
  port: DatabaseConfig.DB_PORT,
  username: DatabaseConfig.DB_USER,
  password: DatabaseConfig.DB_PASSWORD,
  database: DatabaseConfig.DB_DATABASE,
  synchronize: false,
  logging: DatabaseConfig.DB_LOGGING,
  timezone: '+00:00',
  migrationsTableName: '_typeorm_migrations',
  metadataTableName: '_typeorm_metadata',
  /**
   * @/dev MUST use relative path to these files for the sake of production.
   */
  entities: [path.join(__dirname, 'entities', '*{.entity.ts,.entity.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.migration.ts,.seed.ts,.migration.js,.seed.js}')],
  subscribers: [path.join(__dirname, 'subscribers', '*{.subscriber.ts,.subscriber.js}')],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
} as ConnectionOptions;

export default dbConnection;
