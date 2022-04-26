import { Logger } from '../..';

import type { Middleware } from '..';

const log = new Logger('logRequest');

const logRequest: Middleware = (req, res, next) => {
  log.info(`${req.method} ${req.originalUrl}`);

  next();
};

export default logRequest;
