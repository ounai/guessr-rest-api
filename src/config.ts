import type { DatabaseConfig } from './db/Database';
import type { APIConfig } from './api/API';

const database: DatabaseConfig = {
  enableLogging: true,
  dialect: 'sqlite',
  storage: ':memory:'
};

const api: APIConfig = {
  path: 'api',
  version: 1,
  servers: {
    http: {
      enabled: true,
      port: 9001
    },
    https: {
      enabled: false
      // port: 9002
    }
  },
  staticPaths: [
    'public'
  ],
  enableBodyParser: true
};

const config = {
  logging: {
    maxTitleLength: 18
  },
  database,
  api
};

export default config;
