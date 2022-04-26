import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import * as routes from './routes';
import { Logger } from '..';
import { logRequest } from './middleware';

import type { Express } from 'express';

const log = new Logger('API');

interface HTTPConfig {
  port: number;
}

interface HTTPSConfig {
  port: number;
  // TODO credentials
}

type EnableConfig<T> =
  | { enabled: false }
  | { enabled: true } & T;

export interface APIConfig {
  path: string;
  version: number;
  servers: {
    http: EnableConfig<HTTPConfig>;
    https: EnableConfig<HTTPSConfig>;
  };
  staticPaths: string[];
  enableBodyParser: boolean;
}

export default class API {
  #app: Express;
  #config: APIConfig;

  #validateConfig () {
    const { path, version } = this.#config;

    if (path.startsWith('/') || path.endsWith('/')) {
      throw new Error(`Invalid config.path ${path}`);
    }

    if (!Number.isInteger(version) || version < 1) {
      throw new Error(`Invalid config.version ${version}`);
    }
  }

  get #apiPath () {
    return `/${this.#config.path}/v${this.#config.version}`;
  }

  constructor (config: APIConfig) {
    this.#config = config;
    this.#validateConfig();

    this.#app = express();
  }

  init () {
    log.info('Init API...');

    if (this.#config.enableBodyParser) {
      this.#app.use(bodyParser.json());
      this.#app.use(bodyParser.urlencoded({ extended: true }));
    }

    // Log API requests
    this.#app.use(this.#apiPath, logRequest);

    // API routes
    for (const route of Object.values(routes)) {
      const path = `${this.#apiPath}/${route.routePath}`;

      log.debug('Init API route', path);

      this.#app.use(path, route.expressRouter);
    }

    // Static files
    for (const staticPath of this.#config.staticPaths) {
      log.debug('Init static path', staticPath);

      this.#app.use(express.static(staticPath));
    }

    log.info('API initialized!');

    return this;
  }

  listen () {
    const { http: httpConfig, https: httpsConfig } = this.#config.servers;

    if (httpConfig.enabled) {
      http.createServer(this.#app).listen(httpConfig.port, () => {
        log.info(`HTTP server listening on port ${httpConfig.port}`);
      });
    }

    if (httpsConfig.enabled) {
      // TODO
    }

    return this;
  }
}
