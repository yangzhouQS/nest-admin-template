import { ObjectLiteral } from '../util';
import { CrudRoutesFactory } from '../crud';

export const OrmCrud = (options: ObjectLiteral) => {
  return (target: unknown): void => {
    const factoryMethod = options.routesFactory || CrudRoutesFactory;
    const factory = new factoryMethod(target, options);
  };
};
