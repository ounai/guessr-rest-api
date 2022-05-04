import { Sequelize, Options } from 'sequelize';

import * as Models from './models';
import { Logger } from '../';

const log = new Logger('Database');

export type DatabaseConfig = Options & {
  enableLogging: boolean;
};

export default class Database {
  #sequelize: Sequelize;

  constructor (config: DatabaseConfig) {
    log.info('Initializing database connection...');

    const { enableLogging, ...sequelizeConfig } = config;

    this.#sequelize = new Sequelize({
      ...sequelizeConfig,
      logging: (enableLogging ? msg => log.debug(msg) : false)
    });
  }

  async #syncAllModels () {
    log.debug('Syncing models...');

    await this.#sequelize.sync();
  }

  async init () {
    log.info('Connecting to the database...');

    // Initialization
    for (const Model of Object.values(Models)) {
      log.debug('Init model', Model.name);

      Model.init(Model.columns, {
        sequelize: this.#sequelize,
        timestamps: true
      });
    }

    // Association
    for (const Model of Object.values(Models)) {
      // @ts-ignore: allowed to not exist
      if (typeof Model.associate === 'function') {
        log.debug('Associate model', Model.name);

        // @ts-ignore
        Model.associate();
      }
    }

    await this.#syncAllModels();

    // Fill with predefined rows
    for (const Model of Object.values(Models)) {
      // @ts-ignore: rows are allowed to not exist
      if (Array.isArray(Model.rows)) {
        log.debug('Clearing model', Model.name);

        await Model.destroy({ truncate: true });

        // @ts-ignore: arrayness is already checked
        for (const row of Model.rows) await Model.create(row);
      }
    }

    // Run after-init hooks
    for (const Model of Object.values(Models)) {
      // @ts-ignore: after init hook is allowed to not exist
      if (typeof Model.afterInit === 'function') Model.afterInit(this.#sequelize);
    }

    log.info('Database connection successful!');

    return this;
  }
}
