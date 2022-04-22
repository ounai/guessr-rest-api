'use strict';

const fs = require('fs');

class Utils {
  static getRandomInt (max: number) {
    return Math.floor(Math.random() * max);
  }

  static getFilenamesInDirectory (dir: string, ext?: string) {
    return fs.readdirSync(dir)
      .filter((filename: string) => !ext || filename.endsWith(`.${ext}`));
  }

  static currentTimeString () {
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return dateTimeFormat.format(new Date());
  }
}

module.exports = Utils;
