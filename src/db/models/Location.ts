import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize
} from 'sequelize';

export default class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare id: CreationOptional<number>;

  declare latitude: number;
  declare longitude: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static #sequelize: Sequelize;

  static readonly columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  };

  // TODO: Mock rows only for testing
  static readonly rows = [
    {
      // Null Island
      latitude: 0,
      longitude: 0
    },
    {
      // Helsinki, Finland
      latitude: 60.1699,
      longitude: 24.9384
    }
  ];

  static afterInit (sequelize: Sequelize) {
    this.#sequelize = sequelize;
  }

  static async findRandomId (): Promise<number | null> {
    return (await this.findOne({
      attributes: ['id'],
      order: this.#sequelize.random()
    }))?.id ?? null;
  }
}
