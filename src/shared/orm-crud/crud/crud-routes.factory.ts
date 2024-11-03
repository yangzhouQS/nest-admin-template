import { CrudOptions } from "../interfaces/crud-options.interface";
import { BaseRoute } from "../interfaces/base-route.interface";
import { RequestMethod } from "@nestjs/common";
import { forEach, get, isFunction, isNil } from "lodash";
import { BaseRouteName } from "../types/base-route-name.type";
import { CrudRequest } from "../interfaces/crud-request.interface";
import { R } from "./reflection.helper";
import { isEqual, isFalse, isIn, isObjectFull, objKeys } from "../util";
import { CrudActions } from "../enums";
import { CrudSwaggerHelper } from "./swagger.helper";
import { SerializeHelper } from "./serialize.helper";
import { CrudConfigService } from "../module/crud-config.service";
import * as deepmerge from "deepmerge";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";

/**
 * 路由及其swagger配置初始化
 */
export class CrudRoutesFactory {
  protected options: CrudOptions;

  protected swaggerModels: any = {};

  /**
   * 构造函数
   * @param target 装饰器修饰的controller类
   * @param {CrudOptions} options 配置
   */
  constructor(protected target: any, options: CrudOptions) {
    this.options = options;
    console.log("CrudRoutesFactory: ", options, target);
    this.initCrudRoute();
  }

  static create(target: any, options: CrudOptions): CrudRoutesFactory {
    return new CrudRoutesFactory(target, options);
  }

  /**
   * 路由配置初始化
   * @private
   */
  private initCrudRoute() {
    const routesSchema = this.getRoutesSchema();
    /**
     * 合并装饰器参数配置
     */
    this.mergeOptions();

    // 设置tags
    this.setControllerTags();

    /**
     * 设置返回模型
     */
    // this.setResponseModels();

    /**
     * 创建路由,生成设置nest路由配置
     */
    this.createRoutes(routesSchema);


    /**
     * 覆盖路由
     */
    this.overrideRoutes(routesSchema);

    /**
     * 启用路由
     */
    this.enableRoutes(routesSchema);
  }

  /**
   * 创建路由tags分组
   * @private
   */
  private setControllerTags() {
    const tags = this.options.tags || [this.modelType];
    CrudSwaggerHelper.setControllerTags(tags, this.target);
  }

  protected mergeOptions() {
    // merge auth config
    const authOptions = R.getCrudAuthOptions(this.target);
    this.options.auth = isObjectFull(authOptions) ? authOptions : {};
    /*if (isUndefined(this.options.auth.property)) {
      this.options.auth.property = CrudConfigService.config.auth.property;
    }
    if (isUndefined(this.options.auth.groups)) {
      this.options.auth.groups = CrudConfigService.config.auth.groups;
    }
    if (isUndefined(this.options.auth.classTransformOptions)) {
      this.options.auth.classTransformOptions = CrudConfigService.config.auth.classTransformOptions;
    }*/

    // merge query config
    this.options.query = isObjectFull(this.options.query) ? this.options.query : {}; // { ...CrudConfigService.config.query, ...query };

    // merge routes config
    const routes = isObjectFull(this.options.routes) ? this.options.routes : {};
    this.options.routes = deepmerge(CrudConfigService.config.routes, routes, {
      arrayMerge: (a, b, c) => b
    });

    // set params
    /*this.options.params = isObjectFull(this.options.params)
      ? this.options.params
      : isObjectFull(CrudConfigService.config.params)
        ? CrudConfigService.config.params
        : {};*/

    this.options.params = {} as any;
    const hasPrimary = this.getPrimaryParams().length > 0;
    if (!hasPrimary) {
      this.options.params["id"] = {
        field: "id",
        type: "number",
        primary: true
      };
    }

    // set dto
    if (!isObjectFull(this.options.dto)) {
      this.options.dto = {};
    }

    // set serialize
    const serialize = isObjectFull(this.options.serialize) ? this.options.serialize : {};
    this.options.serialize = { ...CrudConfigService.config.serialize, ...serialize };
    this.options.serialize.get = isFalse(this.options.serialize.get)
      ? false
      : this.options.serialize.get || this.modelType;
    this.options.serialize.getMany = isFalse(this.options.serialize.getMany)
      ? false
      : this.options.serialize.getMany
        ? this.options.serialize.getMany
        : isFalse(this.options.serialize.get)
          ? /* istanbul ignore next */ false
          : SerializeHelper.createGetManyDto(this.options.serialize.get, this.modelName);
    this.options.serialize.create = isFalse(this.options.serialize.create)
      ? false
      : this.options.serialize.create || this.modelType;
    this.options.serialize.update = isFalse(this.options.serialize.update)
      ? false
      : this.options.serialize.update || this.modelType;
    this.options.serialize.replace = isFalse(this.options.serialize.replace)
      ? false
      : this.options.serialize.replace || this.modelType;
    this.options.serialize.delete =
      isFalse(this.options.serialize.delete) || !this.options.routes.deleteOneBase?.returnDeleted
        ? false
        : this.options.serialize.delete || this.modelType;

    R.setCrudOptions(this.options, this.target);
  }

  protected setResponseModels() {

    const modelType = isFunction(this.modelType)
      ? this.modelType
      : SerializeHelper.createGetOneResponseDto(this.modelName);
    this.swaggerModels.get = isFunction(this.options.serialize.get) ? this.options.serialize.get : modelType;
    this.swaggerModels.getMany =
      this.options.serialize.getMany || SerializeHelper.createGetManyDto(this.swaggerModels.get, this.modelName);
    this.swaggerModels.create = isFunction(this.options.serialize.create) ? this.options.serialize.create : modelType;
    this.swaggerModels.update = isFunction(this.options.serialize.update) ? this.options.serialize.update : modelType;
    this.swaggerModels.replace = isFunction(this.options.serialize.replace)
      ? this.options.serialize.replace
      : modelType;
    this.swaggerModels.delete = isFunction(this.options.serialize.delete) ? this.options.serialize.delete : modelType;
    this.swaggerModels.recover = isFunction(this.options.serialize.recover)
      ? this.options.serialize.recover
      : modelType;
    CrudSwaggerHelper.setExtraModels(this.swaggerModels);
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
    return get(this.options, "model.name", "");
    // return this.options.model.type.name;
  }

  protected get modelType(): any {
    return get(this.options, "model.type", "");
    // return this.options.model.type;
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
      recoverOneBase: CrudActions.RecoverOne
    };
  }

  protected getRoutesSchema(): BaseRoute[] {
    return [
      {
        name: "getOneBase",
        path: "/",
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: true
      },
      {
        name: "getManyBase",
        path: "/get-many",
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false
      },
      {
        name: "createOneBase",
        path: "/create-one",
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false
      }
    ];
  }

  private createRoutes(routesSchema: BaseRoute[]) {
    // 位置参数
    const primaryParams = this.getPrimaryParams();

    forEach(routesSchema, (route: BaseRoute) => {
      // controller bind method call service method
      this[route.name](route.name);
      route.enable = true;

      console.log("route:", route);

      // set metadata
      this.setBaseRouteMeta(route.name);

      // 设置查询主键的路径参数
      if (route.withParams && primaryParams.length > 0) {
        route.path =
          route.path !== "/"
            ? `${primaryParams.map((param) => `/:${param}`).join("")}${
              route.path
            }`
            : primaryParams.map((param) => `/:${param}`).join("");
      }
    });
  }

  protected overrideRoutes(routesSchema: BaseRoute[]) {
    Object.getOwnPropertyNames(this.targetProto).forEach((name) => {
      const override = R.getOverrideRoute(this.targetProto[name]);
      const route = routesSchema.find((r) => isEqual(r.name, override));

      if (override && route && route.enable) {
        // get metadata
        const interceptors = R.getInterceptors(this.targetProto[name]);
        const baseInterceptors = R.getInterceptors(this.targetProto[override]);
        const baseAction = R.getAction(this.targetProto[override]);
        const operation = CrudSwaggerHelper.getOperation(this.targetProto[name]);
        const baseOperation = CrudSwaggerHelper.getOperation(this.targetProto[override]);
        const swaggerParams = CrudSwaggerHelper.getParams(this.targetProto[name]);
        const baseSwaggerParams = CrudSwaggerHelper.getParams(this.targetProto[override]);
        const responseOk = CrudSwaggerHelper.getResponseOk(this.targetProto[name]);
        const baseResponseOk = CrudSwaggerHelper.getResponseOk(this.targetProto[override]);
        // set metadata
        R.setInterceptors([...baseInterceptors, ...interceptors], this.targetProto[name]);
        R.setAction(baseAction, this.targetProto[name]);
        CrudSwaggerHelper.setOperation({ ...baseOperation, ...operation }, this.targetProto[name]);
        CrudSwaggerHelper.setParams([...baseSwaggerParams, ...swaggerParams], this.targetProto[name]);
        CrudSwaggerHelper.setResponseOk({ ...baseResponseOk, ...responseOk }, this.targetProto[name]);
        this.overrideParsedBodyDecorator(override, name);
        // enable route
        R.setRoute(route, this.targetProto[name]);
        route.override = true;
      }
    });
  }

  protected enableRoutes(routesSchema: BaseRoute[]) {
    routesSchema.forEach((route) => {
      if (!route.override && route.enable) {
        R.setRoute(route, this.targetProto[route.name]);
      }
    });
  }

  protected overrideParsedBodyDecorator(override: BaseRouteName, name: string) {
    const allowed = ["createManyBase", "createOneBase", "updateOneBase", "replaceOneBase"] as BaseRouteName[];
    const withBody = isIn(override, allowed);
    const parsedBody = R.getParsedBody(this.targetProto[name]);

    if (withBody && parsedBody) {
      const baseKey = `${RouteParamtypes.BODY}:1`;
      const key = `${RouteParamtypes.BODY}:${parsedBody.index}`;
      const baseRouteArgs = R.getRouteArgs(this.target, override);
      const routeArgs = R.getRouteArgs(this.target, name);
      const baseBodyArg = baseRouteArgs[baseKey];
      R.setRouteArgs(
        {
          ...routeArgs,
          [key]: {
            ...baseBodyArg,
            index: parsedBody.index
          }
        },
        this.target,
        name
      );

      /* istanbul ignore else */
      if (isEqual(override, "createManyBase")) {
        const paramTypes = R.getRouteArgsTypes(this.targetProto, name);
        const metatype = paramTypes[parsedBody.index];
        const types = [String, Boolean, Number, Array, Object];
        const toCopy = isIn(metatype, types) || /* istanbul ignore next */ isNil(metatype);

        /* istanbul ignore else */
        if (toCopy) {
          const baseParamTypes = R.getRouteArgsTypes(this.targetProto, override);
          const baseMetatype = baseParamTypes[1];
          paramTypes.splice(parsedBody.index, 1, baseMetatype);
          R.setRouteArgsTypes(paramTypes, this.targetProto, name);
        }
      }
    }
  }

  private getPrimaryParams(): string[] {
    return objKeys(this.options.params).filter(
      (param) => this.options.params[param] && this.options.params[param].primary
    );
  }

  /**
   * 单条查询
   * @param {BaseRouteName} name
   * @protected
   */
  protected getOneBase(name: BaseRouteName) {
    console.log("targetProto: ", this.targetProto);
    /**
     * 在修饰器原型上创建方法,调用service方法
     * @param {CrudRequest} req
     * @returns {any}
     */
    this.targetProto[name] = function getOneBase(req: CrudRequest) {
      console.log("req:", req);
      return "hello getOneBase";
      return this.ormService.getOne(req);
    };

    console.log("targetProto: ", this.targetProto);
  }

  /**
   * 多条查询
   * @param {BaseRouteName} name
   * @protected
   */
  protected getManyBase(name: BaseRouteName) {
    this.targetProto[name] = function getManyBase(req: CrudRequest) {
      return this.ormService.getMany(req);
    };
  }

  /**
   * 创建单条
   * @param {BaseRouteName} name
   * @protected
   */
  protected createOneBase(name: BaseRouteName) {
    this.targetProto[name] = function createOneBase(req: CrudRequest, dto: any) {
      return this.ormService.createOne(req, dto);
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
    R.setRouteArgs({ ...R.setParsedRequestArg(0), ...rest }, this.target, name);
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
      this.targetProto[name]
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
    console.log("setSwaggerOperation: ", name);
    const summary = CrudSwaggerHelper.operationsMap(this.modelName)[name];
    const operationId =
      name + this.targetProto.constructor.name + this.modelName;
    CrudSwaggerHelper.setOperation(
      { summary, operationId },
      this.targetProto[name]
    );
  }

  /**
   * 设置swagger 路径参数
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerPathParams(name: BaseRouteName) {

    const metadata = CrudSwaggerHelper.getParams(this.targetProto[name]);
    const withoutPrimary: BaseRouteName[] = ["createManyBase", "createOneBase", "getManyBase"];

    const removePrimary = isIn(name, withoutPrimary);
    const params = objKeys(this.options.params)
      .filter((key) => !this.options.params[key].disabled)
      .filter((key) => !(removePrimary && this.options.params[key].primary))
      .reduce((a, c) => ({ ...a, [c]: this.options.params[c] }), {});

    const pathParamsMeta = CrudSwaggerHelper.createPathParamsMeta(params);
    CrudSwaggerHelper.setParams([...metadata, ...pathParamsMeta], this.targetProto[name]);

  }

  /**
   * 设置swagger 查询参数
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerQueryParams(name: BaseRouteName) {
    const metadata = CrudSwaggerHelper.getParams(this.targetProto[name]);
    const queryParamsMeta = CrudSwaggerHelper.createQueryParamsMeta(name, this.options);
    CrudSwaggerHelper.setParams([...metadata, ...queryParamsMeta], this.targetProto[name]);
  }

  /**
   * 设置swagger 响应
   * @param {BaseRouteName} name
   * @private
   */
  private setSwaggerResponseOk(name: BaseRouteName) {
    const metadata = CrudSwaggerHelper.getResponseOk(this.targetProto[name]);
    const metadataToAdd =
      CrudSwaggerHelper.createResponseMeta(name, this.options, this.swaggerModels) || /* istanbul ignore next */ {};
    CrudSwaggerHelper.setResponseOk({ ...metadata, ...metadataToAdd }, this.targetProto[name]);
  }

  /**
   * 设置装饰器
   * @param {BaseRouteName} name
   * @private
   */
  private setDecorators(name: BaseRouteName) {
    const decorators = get(this.options, `routes[${name}].decorators`, []); // this.options.routes[name].decorators;
    R.setDecorators(Array.isArray(decorators) ? /* istanbul ignore next */ decorators : [], this.targetProto, name);
  }
}