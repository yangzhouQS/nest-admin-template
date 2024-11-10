import { Type, ValidationPipeOptions } from '@nestjs/common';
import { ObjectLiteral } from '../util';
import { ModelOptions } from './model-options.interface';
import { CrudRoutesFactory } from '../crud/crud-routes.factory';
import { ParamsOptions } from "../crud-request";

export interface CrudRequestOptions {
  query?: Record<string, any>;
  routes?: ObjectLiteral;
  params?: ObjectLiteral;
}

export interface AuthOptions {
  property?: string;
  /** Get options for the `classToPlain` function (response) */
  classTransformOptions?: (req: any) => () => {};
  /** Get `groups` value for the `classToPlain` function options (response) */
  groups?: (req: any) => string[];
  filter?: (req: any) => void;
  or?: (req: any) => void;
  persist?: (req: any) => ObjectLiteral;
}

export interface DtoOptions {
  create?: any;
  update?: any;
  replace?: any;
}

/**
 * 选修的
 *
 * 响应序列化 DTO 类。每个选项还接受false以便不对特定路由执行序列化。
 *
 * 请参阅响应序列化部分以获取更多详细信息。
 */
export interface SerializeOptions {
  getMany?: Type<any> | false;
  get?: Type<any> | false;
  create?: Type<any> | false;
  createMany?: Type<any> | false;
  update?: Type<any> | false;
  replace?: Type<any> | false;
  delete?: Type<any> | false;
  recover?: Type<any> | false;
}

export interface CrudOptions {
  /**
   * controller 控制器分组tags
   */
  tags?: string[];

  /**
   * 必需的
   *
   * EntityModel或类必须在此处提供。下面描述的所有其他内容都是可选DTO的。它是基于 NestJS 的内置验证所必需的ValidationPipe。
   */
  model?: ModelOptions;

  /**
   * 可选的
   *
   * 请求主体验证 DTO 类。如果没有为任何选项提供 DTO，则将CrudOptions.model.type使用请求验证部分中所述的 DTO。
   */
  dto?: DtoOptions;

  /***
   * 可选的
   * 响应序列化DTO类。每个选项还接受false以便不对特定路由执行序列化。
   * 参考: https://github.com/nestjsx/crud/wiki/Controllers#response-serialization
   */
  serialize?: ObjectLiteral;
  query?: ObjectLiteral;
  routes?: ObjectLiteral;
  routesFactory?: typeof CrudRoutesFactory;
  params?: ParamsOptions;

  /**
   * 接受ValidationPipe选项或者false如果您想使用自己的验证实现。
   */
  validation?: ValidationPipeOptions | false;

  auth?: AuthOptions;
}
