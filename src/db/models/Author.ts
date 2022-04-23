import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  DataTypes,

  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';

import { Book } from '.';

export default class Author extends Model<
  InferAttributes<Author, { omit: 'books' }>,
  InferCreationAttributes<Author, { omit: 'books' }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getBooks: HasManyGetAssociationsMixin<Book>;
  declare addBook: HasManyAddAssociationMixin<Book, number>;
  declare addBooks: HasManyAddAssociationsMixin<Book, number>;
  declare setBooks: HasManySetAssociationsMixin<Book, number>;
  declare removeBook: HasManyRemoveAssociationMixin<Book, number>;
  declare removeBooks: HasManyRemoveAssociationsMixin<Book, number>;
  declare hasBook: HasManyHasAssociationMixin<Book, number>;
  declare hasBooks: HasManyHasAssociationsMixin<Book, number>;
  declare countBooks: HasManyCountAssociationsMixin;
  declare createBook: HasManyCreateAssociationMixin<Book, 'authorId'>;

  declare books?: NonAttribute<Book[]>;

  declare static associations: {
    books: Association<Author, Book>;
  };

  static readonly columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  };

  static readonly rows = [
    { name: 'Mr Coder' },
    { name: 'Mrs Codesworth' }
  ];

  static associate () {
    Author.hasMany(Book);
  }
}
