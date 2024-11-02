import { ValidationPipeOptions } from '@nestjs/common';
import { ObjectLiteral } from '../util';
import { ModelOptions } from './model-options.interface';
import { CrudRoutesFactory } from '../crud/crud-routes.factory';

export interface CrudRequestOptions {
  query?: Record<string, any>;
  routes?: ObjectLiteral;
  params?: ObjectLiteral;
}

export interface CrudOptions {
  model: ModelOptions;
  dto?: any;
  serialize?: ObjectLiteral;
  query?: ObjectLiteral;
  routes?: ObjectLiteral;
  routesFactory?: typeof CrudRoutesFactory;
  params?: CrudRoutesFactory;
  validation?: ValidationPipeOptions | false;
}
