import dotenv from 'dotenv';

import type { DatabaseConfig } from './db/Database';
import type { APIConfig } from './api/API';

dotenv.config();

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
      enabled: true,
      port: 9002,
      forwardHTTP: true,
      keyPath: process.env.HTTPS_KEY_PATH,
      certPath: process.env.HTTPS_CERT_PATH
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
