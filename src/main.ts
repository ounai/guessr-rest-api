import { Database } from './db';
import { API } from './api';
import { Logger, config } from '.';

const log = new Logger('main');

const main = async () => {
  log.info('Initializing...');

  await new Database(config.database).init();
  new API(config.api).init().listen();
};

export default main;
