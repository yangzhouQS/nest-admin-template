import { BaseRouteName } from '../types/base-route-name.type';
import { safeRequire } from '../util';
import { R } from './reflection.helper';
const pluralize = require('pluralize');

import { DECORATORS } from '@nestjs/swagger/dist/constants';

export const swagger = safeRequire('@nestjs/swagger', () =>
  require('@nestjs/swagger'),
);
/*export const swaggerConst = safeRequire('@nestjs/swagger/dist/constants', () =>
  require('@nestjs/swagger/dist/constants'),
);*/
import {} from '@nestjs/swagger';
export const swaggerPkgJson = safeRequire('@nestjs/swagger/package.json', () =>
  require('@nestjs/swagger/package.json'),
);

export class CrudSwaggerHelper {
  static operationsMap(modelName: string): { [key in BaseRouteName]: string } {
    return {
      getManyBase: `Retrieve multiple ${pluralize(modelName)}`,
      getOneBase: `Retrieve a single ${modelName}`,
      createManyBase: `Create multiple ${pluralize(modelName)}`,
      createOneBase: `Create a single ${modelName}`,
      updateOneBase: `Update a single ${modelName}`,
      replaceOneBase: `Replace a single ${modelName}`,
      deleteOneBase: `Delete a single ${modelName}`,
      recoverOneBase: `Recover one ${modelName}`,
    };
  }

  static setOperation(metadata: unknown, func: any): void {
    /* istanbul ignore else */
    R.set(DECORATORS.API_OPERATION, metadata, func);
  }

  static getOperation(func: any): any {
    return R.get(DECORATORS.API_OPERATION, func) || {};
  }

  static setParams(metadata: unknown, func: any): void {
    /* istanbul ignore else */
    R.set(DECORATORS.API_PARAMETERS, metadata, func);
  }

  static getParams(func: any): any[] {
    return R.get(DECORATORS.API_PARAMETERS, func) || [];
  }
}
