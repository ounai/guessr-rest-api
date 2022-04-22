import { Database } from './db';
import { Logger, config } from '.';

const log = new Logger('main');

const main = async () => {
  log.info('Initializing...');

  await new Database(config.database).init();
};

export default main;
