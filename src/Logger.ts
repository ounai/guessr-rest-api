/* eslint-disable no-console */
'use strict';

const chalk = require('chalk');

const config = require('./config');
const { currentTimeString } = require('./Utils');

const debug = (process.env.NODE_ENV !== 'production');
const disabled = (process.env.NODE_ENV === 'test');

class Logger {
  title?: string;

  constructor (title?: string) {
    if (debug && title) {
      this.title = title.slice(0, config.logging.maxTitleLength);

      if (title.length > config.logging.maxTitleLength) {
        console.log(
          '[',
          chalk.red('Logger warning: Title'),
          chalk.magenta(title),
          chalk.red('is too long, truncated to'),
          chalk.magenta(this.title),
          ']'
        );
      }
    }
  }

  #getLeader (stream: string, spaces: number = 0) {
    const title = (
      this.title
        ? (' '.repeat(spaces) + ' '.repeat(config.logging.maxTitleLength - this.title.length) + this.title)
        : ''
    );

    return `[${currentTimeString()}, ${stream}]${title}`;
  }

  info (...args: any[]) {
    if (!disabled) console.log(chalk.green(this.#getLeader('INFO', 2)), ...args);
  }

  debug (...args: any[]) {
    if (debug && !disabled) console.log(chalk.yellow(this.#getLeader('DEBUG', 1)), ...args);
  }

  error (...args: any[]) {
    if (!disabled) console.error(chalk.red(this.#getLeader('ERROR', 1)), ...args);
  }

  debugError (...args: any[]) {
    if (debug && !disabled) this.error(...args);
  }
}

const defaultLogger = new Logger();

module.exports = (title: string) => new Logger(title);
module.exports.info = (...args: any[]) => defaultLogger.info(...args);
module.exports.debug = (...args: any[]) => defaultLogger.debug(...args);
module.exports.error = (...args: any[]) => defaultLogger.error(...args);
module.exports.debugError = (...args: any[]) => defaultLogger.debugError(...args);
