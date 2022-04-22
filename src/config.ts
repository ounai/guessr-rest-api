import type { DatabaseConfig } from './db/Database';

const database: DatabaseConfig = {
  enableLogging: true,
  modelsPath: 'db/models',
  dialect: 'sqlite',
  storage: ':memory:'
};

const config = {
  logging: {
    maxTitleLength: 18
  },
  database
};

export default config;
