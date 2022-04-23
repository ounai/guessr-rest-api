import { Database } from './db';
import { Logger, config } from '.';

import { Book, Author } from './db/models';

const log = new Logger('main');

const main = async () => {
  log.info('Initializing...');

  await new Database(config.database).init();

  const book = await Book.findOne();
  const author = await Author.findOne();

  if (book && author) {
    await author.addBook(book);
  }

  log.debug(
    'Books:',
    (await Book.findAll()).map(b => b.toJSON())
  );

  log.debug(
    'Authors:',
    (await Author.findAll()).map(b => b.toJSON())
  );
};

export default main;
