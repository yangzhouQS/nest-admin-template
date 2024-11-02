import { CrudOptions } from '../interfaces/crud-options.interface';
import { BaseRoute } from '../interfaces/base-route.interface';
import { RequestMethod } from '@nestjs/common';
import { forEach } from 'lodash';
import { BaseRouteName } from '../types/base-route-name.type';
import { CrudRequest } from '../interfaces/crud-request.interface';
import { R } from './reflection.helper';
import { isArrayFull } from '../util';
import { CrudActions } from '../enums';
import { CrudSwaggerHelper } from './swagger.helper';
import { get } from 'lodash';

/**
 * 路由及其swagger配置初始化
 */
export class CrudRoutesFactory {
  protected options: CrudOptions;

  /**
   * 构造函数
   * @param target 装饰器修饰的controller类
   * @param {CrudOptions} options 配置
   */
  constructor(protected target: any, options: CrudOptions) {
    this.options = options;
    console.log('CrudRoutesFactory', options, target);
    this.initCrudRoute();
  }

  static create(target: any, options: CrudOptions): CrudRoutesFactory {
    return new CrudRoutesFactory(target, options);
  }

  private initCrudRoute() {
    const routesSchema = this.getRoutesSchema();

    this.createRoutes(routesSchema);
  }

  /**
   * 修饰控制器的原型
   * @returns {any}
   * @protected
   */
  protected get targetProto(): any {
    return this.target.prototype;
  }

  protected get modelName(): string {
    return get(this.options, 'model.type.name', '');
    // return this.options.model.type.name;
  }

  protected get modelType(): any {
    return this.options.model.type;
  }

  protected get actionsMap(): { [key in BaseRouteName]: CrudActions } {
    return {
      getManyBase: CrudActions.ReadAll,
      getOneBase: CrudActions.ReadOne,
      createManyBase: CrudActions.CreateMany,
      createOneBase: CrudActions.CreateOne,
      updateOneBase: CrudActions.UpdateOne,
      deleteOneBase: CrudActions.DeleteOne,
      replaceOneBase: CrudActions.ReplaceOne,
      recoverOneBase: CrudActions.RecoverOne,
    };
  }

  protected getRoutesSchema(): BaseRoute[] {
    return [
      {
        name: 'getOneBase',
        path: '/',
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: true,
      },
    ];
  }

  private createRoutes(routesSchema: BaseRoute[]) {
    // 位置参数
    const primaryParams = this.getPrimaryParams();

    forEach(routesSchema, (route: BaseRoute) => {
      // controller bind method call service method
      this[route.name](route.name);
      route.enable = true;

      // set metadata
      this.setBaseRouteMeta(route.name);

      if (route.withParams && primaryParams.length > 0) {
        route.path =
          route.path !== '/'
            ? `${primaryParams.map((param) => `/:${param}`).join('')}${
                route.path
              }`
            : primaryParams.map((param) => `/:${param}`).join('');
      }
    });
  }

  private getPrimaryParams(): string[] {
    return [];
  }

  protected getOneBase(name: BaseRouteName) {
    /**
     * 在修饰器原型上创建方法,调用service方法
     * @param {CrudRequest} req
     * @returns {any}
     */
    this.targetProto[name] = function getOneBase(req: CrudRequest) {
      return this.ormCrudService.getOne(req);
    };
  }

  /**
   * 设置路由元数据,swagger初始化
   * @param {BaseRouteName} name
   * @private
   */
  private setBaseRouteMeta(name: BaseRouteName) {
    this.setRouteArgs(name);
    this.setRouteArgsTypes(name);
    this.setInterceptors(name);
    this.setAction(name);
    this.setSwaggerOperation(name);
    this.setSwaggerPathParams(name);
    this.setSwaggerQueryParams(name);
    this.setSwaggerResponseOk(name);
    // set decorators after Swagger so metadata can be overwritten
    this.setDecorators(name);
  }

  private setRouteArgs(name: BaseRouteName) {
    const rest = {};
    const tss = R.setParsedRequestArg(0);
    console.log(tss);

    // R.setRouteArgs({ ...R.setParsedRequestArg(0), ...rest }, this.target, name);
    R.setRouteArgs(
      Object.assign({}, /*R.setParsedRequestArg(0),*/ rest),
      this.target,
      name,
    );
  }

  /**
   * 设置参数类型
   * @param {BaseRouteName} name
   * @private
   */
  private setRouteArgsTypes(name: BaseRouteName) {
    R.setRouteArgsTypes([Object], this.targetProto, name);
  }

  /**
   * 设置拦截器
   * @param {BaseRouteName} name
   * @private
   */
  private setInterceptors(name: BaseRouteName) {
    R.setInterceptors(
      [
        /*CrudRequestInterceptor, CrudResponseInterceptor*/
      ],
      this.targetProto[name],
    );
  }

  /**
   * 设置action 操作
   * @param {BaseRouteName} name
   * @private
   */
  private setAction(name: BaseRouteName) {
    R.setAction(this.actionsMap[name], this.targetProto[name]);
  }

  /**
   * 设置swagger 操作
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerOperation(name: BaseRouteName) {
    console.log('setSwaggerOperation: ', name);
    const summary = CrudSwaggerHelper.operationsMap(this.modelName)[name];
    const operationId =
      name + this.targetProto.constructor.name + this.modelName;
    CrudSwaggerHelper.setOperation(
      { summary, operationId },
      this.targetProto[name],
    );
  }

  /**
   * 设置swagger 路径参数
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerPathParams(name: BaseRouteName) {

    const metadata = CrudSwaggerHelper.getParams(this.targetProto[name]);

  }

  /**
   * 设置swagger 查询参数
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerQueryParams(name: BaseRouteName) {}

  /**
   * 设置swagger 响应
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerResponseOk(name: BaseRouteName) {}

  /**
   * 设置装饰器
   * @param {BaseRouteName} name
   * @private
   */
  private setDecorators(name: BaseRouteName) {
    R.setDecorators([], this.targetProto, name);
  }
}
