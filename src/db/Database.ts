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
      if (typeof Model.associate === 'function') {
        log.debug('Associate model', Model.name);

        Model.associate();
      }
    }

    // Sync all models
    log.debug('Syncing models...');
    await this.#sequelize.sync();

    // Fill with predefined rows
    for (const Model of Object.values(Models)) {
      const rows = Model.rows;

      if (Array.isArray(rows)) {
        log.debug('Clearing model', Model.name);

        // @ts-ignore a nonsensical warning
        await Model.destroy({ truncate: true });

        // @ts-ignore: arrayness is already checked
        for (const row of rows) {
          // @ts-ignore: invalid row data is ignored for now
          await Model.create(row);
        }
      }
    }

    log.info('Database connection successful!');

    return this;
  }
}
