import { Model } from 'sequelize';

import { Database } from './db';
import { API } from './api';
import { Logger, config } from '.';

import { Book, Author } from './db/models';

const log = new Logger('main');

const main = async () => {
  log.info('Initializing...');

  await new Database(config.database).init();
  new API(config.api).init().listen();

  const book = await Book.findOne();
  const author = await Author.findOne();

  if (book && author) {
    await author.addBook(book);
  }

  const books = await Book.findAll({ include: Author });
  const authors = await Author.findAll({ include: Book });

  const stringifyModels = <T extends Model>(arr: T[]) =>
    JSON.stringify(arr.map(item => item.toJSON()), null, 2);

  log.debug(`Books:\n${stringifyModels(books)}`);
  log.debug(`Authors:\n${stringifyModels(authors)}`);
};

export default main;
