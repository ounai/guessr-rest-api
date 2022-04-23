import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes
} from 'sequelize';

import { Author } from '.';

export default class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  declare id: CreationOptional<number>;

  declare publishYear: number | null;
  declare isPopular: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare authorId: ForeignKey<Author['id']>;

  declare author?: NonAttribute<Author>;

  static readonly columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    publishYear: DataTypes.INTEGER,
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  };

  static readonly rows = [
    {
      title: 'hello world',
      publishYear: 2022,
      isPopular: true
    },
    {
      title: 'goodbye world',
      isPopular: false
    }
  ];

  static associate () {
    Book.belongsTo(Author);
  }
}
