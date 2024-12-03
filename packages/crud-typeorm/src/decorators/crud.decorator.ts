import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const OrmCrud =
  (options: CrudOptions) =>
  (target: unknown): void => {
    const factoryMethod = options.routesFactory || CrudRoutesFactory;
    const factory = new factoryMethod(target, options);
  };
