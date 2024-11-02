import { ValidationPipeOptions } from '@nestjs/common';
import { ObjectLiteral } from '../util';
import { ModelOptions } from './model-options.interface';
import { CrudRoutesFactory } from '../crud/crud-routes.factory';

export interface CrudRequestOptions {
  query?: Record<string, any>;
  routes?: ObjectLiteral;
  params?: ObjectLiteral;
}

export interface AuthOptions {
  property?: string;
  /** Get options for the `classToPlain` function (response) */
  classTransformOptions?: (req: any) => ()=>{};
  /** Get `groups` value for the `classToPlain` function options (response) */
  groups?: (req: any) => string[];
  filter?: (req: any) =>  void;
  or?: (req: any) =>  void;
  persist?: (req: any) => ObjectLiteral;
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

  auth?:AuthOptions
}
