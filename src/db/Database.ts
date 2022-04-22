import path from 'path';
import { Sequelize } from 'sequelize';

import { Logger, Utils } from '../';
import { Model } from '.';

import type { Options as SequelizeOptions } from 'sequelize';

const log = new Logger('Database');

type ModelClass = typeof Model;

export type DatabaseConfig = SequelizeOptions & {
  enableLogging: boolean;
  modelsPath: string;
};

export default class Database {
  #sequelize: Sequelize;
  #modelsPath: string;
  #models: Record<string, ModelClass>;

  async #writeRows (model: ModelClass, rows: any[]) {
    if (rows.length > 0) {
      for (const row of rows) {
        await model.create(row);
      }

      log.debug('Wrote', rows.length, 'rows to table', model.name);
    }
  }

  async #loadModels (modelsPath: string) {
    const filePath = path.join(__dirname, '..', modelsPath);
    const filenames = Utils.getFilenamesInDirectory(filePath, 'js');

    if (filenames.length === 0) {
      log.error(`No model files found in path "${filePath}"`);
    }

    for (const filename of filenames) {
      log.debug('Loading model file', filename);

      if (typeof require.main?.require !== 'function') {
        throw new Error('require.main.require is missing!');
      }

      const model = require.main.require(path.join(filePath, filename));
      const modelName = model.name;

      log.debug('Init model', modelName);

      model.init(model.columns, {
        sequelize: this.#sequelize,
        timestamps: model.timestamps ?? false
      });

      this.#models[modelName] = model;
    }
  }

  async #initAssociations () {
    let associationsCount = 0;
    let modelsCount = 0;

    for (const [modelName, model] of Object.entries(this.#models)) {
      if (model.associated && model.associated.length > 0) modelsCount++;

      for (const association of model.associated) {
        log.debug('Creating association:', modelName, association.type, association.target);

        // @ts-ignore
        model[association.type](this.#models[association.target], association.options ?? {});

        associationsCount++;
      }

      await model.sync();
    }

    log.debug(
      'Done, created',
      associationsCount,
      'associations to',
      modelsCount,
      'out of',
      Object.keys(this.#models).length,
      'models'
    );
  }

  async #setupModels () {
    // Predefined rows
    for (const [modelName, model] of Object.entries(this.#models)) {
      if (model.rows.length > 0) {
        log.debug('Clearing table', modelName);

        await model.destroy({ truncate: true });
        await this.#writeRows(model, model.rows);
      }
    }
  }

  constructor (databaseConfig: DatabaseConfig) {
    log.info('Initializing database connection...');

    if (typeof databaseConfig.modelsPath !== 'string') {
      throw new Error(`Invalid models path ${databaseConfig.modelsPath}`);
    }

    this.#models = {};

    this.#modelsPath = databaseConfig.modelsPath;

    this.#sequelize = new Sequelize({
      ...databaseConfig,
      logging: (databaseConfig.enableLogging ? msg => log.debug(msg) : false)
    });
  }

  async init () {
    log.info('Connecting to the database...');

    this.#models = {};

    await this.#loadModels(this.#modelsPath);
    await this.#initAssociations();
    await this.#setupModels();

    log.info('Database connection successful!');

    const modelNames = Object.keys(this.#models);

    log.debug('Successfully loaded', modelNames.length, 'models:', modelNames.join(', '));
  }
}
