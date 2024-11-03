import { ArgumentsHost } from '@nestjs/common';
import { isFunction } from 'lodash';
import {
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
  CUSTOM_ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import {
  ACTION_NAME_METADATA,
  CRUD_AUTH_OPTIONS_METADATA,
  CRUD_OPTIONS_METADATA,
  OVERRIDE_METHOD_METADATA,
  PARSED_BODY_METADATA,
  PARSED_CRUD_REQUEST_KEY,
} from '../constants';
import { BaseRouteName } from '../types/base-route-name.type';
import { BaseRoute } from '../interfaces/base-route.interface';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { CrudOptions } from '../interfaces/crud-options.interface';
import { CrudActions } from '../enums';

export class R {
  static set(
    metadataKey: any,
    metadataValue: any,
    target: unknown,
    propertyKey: string | symbol = undefined,
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  }

  static get<T extends any>(
    metadataKey: any,
    target: unknown,
    propertyKey: string | symbol = undefined,
  ): T {
    return propertyKey
      ? Reflect.getMetadata(metadataKey, target, propertyKey)
      : Reflect.getMetadata(metadataKey, target);
  }
  static createCustomRouteArg(
    paramtype: string,
    index: number,
    /* istanbul ignore next */
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}${CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
        index,
        factory: (_, ctx) => R.getContextRequest(ctx)[paramtype],
        data,
        pipes,
      },
    };
  }

  static createRouteArg(
    paramtype: RouteParamtypes,
    index: number,
    /* istanbul ignore next */
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}:${index}`]: {
        index,
        pipes,
        data,
      },
    };
  }

  static setDecorators(
    decorators: (PropertyDecorator | MethodDecorator)[],
    target: any,
    name: string,
  ) {
    // this makes metadata decorator works
    const decoratedDescriptor = Reflect.decorate(
      decorators,
      target,
      name,
      Reflect.getOwnPropertyDescriptor(target, name),
    );

    // this makes proxy decorator works
    Reflect.defineProperty(target, name, decoratedDescriptor);
  }

  static setParsedRequestArg(index: number) {
    return R.createCustomRouteArg(PARSED_CRUD_REQUEST_KEY, index);
  }

  static setBodyArg(
    index: number,
    /* istanbul ignore next */ pipes: any[] = [],
  ) {
    return R.createRouteArg(RouteParamtypes.BODY, index, pipes);
  }

  /**
   * 在控制器设置设置保存配置参数
   * @param {CrudOptions} options
   * @param target
   */
  static setCrudOptions(options: CrudOptions, target: any) {
    R.set(CRUD_OPTIONS_METADATA, options, target);
  }

  /**
   * controller 路由设置 请求方法和请求路径
   * @param {BaseRoute} route
   * @param func
   */
  static setRoute(route: BaseRoute, func: unknown) {
    /**
     * 设置请求路径
     */
    R.set(PATH_METADATA, route.path, func);

    /**
     * 设置请求方法
     */
    R.set(METHOD_METADATA, route.method, func);
  }

  static setInterceptors(interceptors: any[], func: unknown) {
    R.set(INTERCEPTORS_METADATA, interceptors, func);
  }

  static setRouteArgs(metadata: any, target: any, name: string) {
    R.set(ROUTE_ARGS_METADATA, metadata, target, name);
  }

  static setRouteArgsTypes(metadata: any, target: any, name: string) {
    R.set(PARAMTYPES_METADATA, metadata, target, name);
  }

  static setAction(action: CrudActions, func: unknown) {
    R.set(ACTION_NAME_METADATA, action, func);
  }

  static setCrudAuthOptions(metadata: any, target: any) {
    R.set(CRUD_AUTH_OPTIONS_METADATA, metadata, target);
  }

  static getCrudAuthOptions(target: any): any {
    return R.get(CRUD_AUTH_OPTIONS_METADATA, target);
  }

  static getCrudOptions(target: any): CrudOptions {
    return R.get(CRUD_OPTIONS_METADATA, target);
  }

  static getAction(func: unknown): CrudActions {
    return R.get(ACTION_NAME_METADATA, func);
  }

  static getOverrideRoute(func: unknown): BaseRouteName {
    return R.get(OVERRIDE_METHOD_METADATA, func);
  }

  static getInterceptors(func: unknown): any[] {
    return R.get(INTERCEPTORS_METADATA, func) || [];
  }

  static getRouteArgs(target: any, name: string): any {
    return R.get(ROUTE_ARGS_METADATA, target, name);
  }

  static getRouteArgsTypes(target: any, name: string): any[] {
    return (
      R.get(PARAMTYPES_METADATA, target, name) || /* istanbul ignore next */ []
    );
  }

  static getParsedBody(func: unknown): any {
    return R.get(PARSED_BODY_METADATA, func);
  }

  static getContextRequest(ctx: ArgumentsHost): any {
    return isFunction(ctx.switchToHttp)
      ? ctx.switchToHttp().getRequest()
      : /* istanbul ignore next */ ctx;
  }
}
