import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from "../interfaces/crud-options.interface";

export const OrmCrud = (options: CrudOptions) => {
  return (target: unknown): void => {
    const factoryMethod = options.routesFactory || CrudRoutesFactory;
    const factory = new factoryMethod(target, options);
  };
};
