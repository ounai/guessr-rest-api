import { Model as SequelizeModel } from 'sequelize';

import type {
  ModelAttributeColumnOptions,
  HasOneOptions,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions
} from 'sequelize';

type Association =
  | { type: 'hasOne', target: string, options?: HasOneOptions }
  | { type: 'hasMany', target: string, options?: HasManyOptions }
  | { type: 'belongsTo', target: string, options?: BelongsToOptions }
  | { type: 'belongsToMany', target: string, options: BelongsToManyOptions };

export default class Model extends SequelizeModel {
  static readonly columns: ModelAttributeColumnOptions<Model>[] = [];
  static readonly rows: any[] = [];
  static readonly associated: Association[] = [];
}
