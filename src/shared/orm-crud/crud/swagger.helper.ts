import { BaseRouteName } from "../types/base-route-name.type";
import { objKeys, safeRequire } from "../util";
import { R } from "./reflection.helper";

const pluralize = require("pluralize");

import { DECORATORS } from "@nestjs/swagger/dist/constants";

import swagger from "@nestjs/swagger";

import { ParamsOptions } from "../crud-request";
import { CrudOptions } from "../interfaces/crud-options.interface";
import { isString } from "lodash";

export const swaggerPkgJson = safeRequire("@nestjs/swagger/package.json", () =>
  require("@nestjs/swagger/package.json")
);

export class CrudSwaggerHelper {
  static operationsMap(modelName: string): { [key in BaseRouteName]: string } {
    return {
      getManyBase: `查询多条 Retrieve multiple ${pluralize(modelName)}`,
      getOneBase: `根据主键id查询单条数据 Retrieve a single ${modelName}`,
      createManyBase: `创建多条数据 Create multiple ${pluralize(modelName)}`,
      createOneBase: `创建单条数据 Create a single ${modelName}`,
      updateOneBase: `更新单条 Update a single ${modelName}`,
      replaceOneBase: `Replace a single ${modelName}`,
      deleteOneBase: `Delete a single ${modelName}`,
      recoverOneBase: `Recover one ${modelName}`
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

  static setResponseOk(metadata: unknown, func: any): void {
    /* istanbul ignore else */
    R.set(DECORATORS.API_RESPONSE, metadata, func);
  }

  static getResponseOk(func: any): any {
    return R.get(DECORATORS.API_RESPONSE, func) || {};
  }

  static getExtraModels(target: unknown): any[] {
    /* istanbul ignore next */
    return R.get(DECORATORS.API_EXTRA_MODELS, target) || []
  }

  /**
   * 创建路由分组
   * @param metadata
   * @param func
   */
  static setControllerTags(metadata: unknown, func: any): void {
    if (DECORATORS){
      R.set(DECORATORS.API_TAGS, metadata, func);
    }
  }

  static setExtraModels(swaggerModels: any): void {
    /* istanbul ignore else */
    if (DECORATORS) {
      const meta = CrudSwaggerHelper.getExtraModels(swaggerModels.get);
      const models: any[] = [
        ...meta,
        ...objKeys(swaggerModels)
          .map((name) => swaggerModels[name])
          .filter((one) => one && one.name !== swaggerModels.get.name),
      ];
      R.set(DECORATORS.API_EXTRA_MODELS, models, swaggerModels.get);
    }
  }


  static createResponseMeta(name: BaseRouteName, options: CrudOptions, swaggerModels: any): any {
    return {};
  }

  static createPathParamsMeta(options: ParamsOptions): any[] {
    return objKeys(options).map((param) => ({
      name: param,
      required: true,
      in: "path",
      type: options[param].type === "number" ? Number : String,
      enum: options[param].enum ? Object.values(options[param].enum) : undefined
    }));
  }

  static createQueryParamsMeta(name: BaseRouteName, options: CrudOptions) {
    return [];
    /* istanbul ignore if */
    /*if (!swaggerConst) {
      return [];
    }*/

    const {
      delim: d,
      delimStr: coma,
      fields,
      search,
      filter,
      or,
      join,
      sort,
      limit,
      offset,
      page,
      cache,
      includeDeleted
    } = CrudSwaggerHelper.getQueryParamsNames();
    const oldVersion = CrudSwaggerHelper.getSwaggerVersion() < 4;
    const docsLink = (a: string) =>
      `<a href="https://github.com/nestjsx/crud/wiki/Requests#${a}" target="_blank">Docs</a>`;

    const fieldsMetaBase = {
      name: fields,
      description: `Selects resource fields. ${docsLink("select")}`,
      required: false,
      in: "query"
    };
    const fieldsMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...fieldsMetaBase,
        type: "array",
        items: {
          type: "string"
        },
        collectionFormat: "csv"
      }
      : {
        ...fieldsMetaBase,
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        },
        style: "form",
        explode: false
      };

    const searchMetaBase = {
      name: search,
      description: `Adds search condition. ${docsLink("search")}`,
      required: false,
      in: "query"
    };
    const searchMeta = oldVersion
      ? /* istanbul ignore next */ { ...searchMetaBase, type: "string" }
      : { ...searchMetaBase, schema: { type: "string" } };

    const filterMetaBase = {
      name: filter,
      description: `Adds filter condition. ${docsLink("filter")}`,
      required: false,
      in: "query"
    };
    const filterMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...filterMetaBase,
        items: {
          type: "string"
        },
        type: "array",
        collectionFormat: "multi"
      }
      : {
        ...filterMetaBase,
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        },
        style: "form",
        explode: true
      };

    const orMetaBase = {
      name: or,
      description: `Adds OR condition. ${docsLink("or")}`,
      required: false,
      in: "query"
    };
    const orMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...orMetaBase,
        items: {
          type: "string"
        },
        type: "array",
        collectionFormat: "multi"
      }
      : {
        ...orMetaBase,
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        },
        style: "form",
        explode: true
      };

    const sortMetaBase = {
      name: sort,
      description: `Adds sort by field. ${docsLink("sort")}`,
      required: false,
      in: "query"
    };
    const sortMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...sortMetaBase,
        items: {
          type: "string"
        },
        type: "array",
        collectionFormat: "multi"
      }
      : {
        ...sortMetaBase,
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        },
        style: "form",
        explode: true
      };

    const joinMetaBase = {
      name: join,
      description: `Adds relational resources. ${docsLink("join")}`,
      required: false,
      in: "query"
    };
    const joinMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...joinMetaBase,
        items: {
          type: "string"
        },
        type: "array",
        collectionFormat: "multi"
      }
      : {
        ...joinMetaBase,
        schema: {
          type: "array",
          items: {
            type: "string"
          }
        },
        style: "form",
        explode: true
      };

    const limitMetaBase = {
      name: limit,
      description: `Limit amount of resources. ${docsLink("limit")}`,
      required: false,
      in: "query"
    };
    const limitMeta = oldVersion
      ? /* istanbul ignore next */ { ...limitMetaBase, type: "integer" }
      : { ...limitMetaBase, schema: { type: "integer" } };

    const offsetMetaBase = {
      name: offset,
      description: `Offset amount of resources. ${docsLink("offset")}`,
      required: false,
      in: "query"
    };
    const offsetMeta = oldVersion
      ? /* istanbul ignore next */ { ...offsetMetaBase, type: "integer" }
      : { ...offsetMetaBase, schema: { type: "integer" } };

    const pageMetaBase = {
      name: page,
      description: `Page portion of resources. ${docsLink("page")}`,
      required: false,
      in: "query"
    };
    const pageMeta = oldVersion
      ? /* istanbul ignore next */ { ...pageMetaBase, type: "integer" }
      : { ...pageMetaBase, schema: { type: "integer" } };

    const cacheMetaBase = {
      name: cache,
      description: `Reset cache (if was enabled). ${docsLink("cache")}`,
      required: false,
      in: "query"
    };
    const cacheMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...cacheMetaBase,
        type: "integer",
        minimum: 0,
        maximum: 1
      }
      : { ...cacheMetaBase, schema: { type: "integer", minimum: 0, maximum: 1 } };

    const includeDeletedMetaBase = {
      name: includeDeleted,
      description: `Include deleted. ${docsLink("includeDeleted")}`,
      required: false,
      in: "query"
    };
    const includeDeletedMeta = oldVersion
      ? /* istanbul ignore next */ {
        ...includeDeletedMetaBase,
        type: "integer",
        minimum: 0,
        maximum: 1
      }
      : {
        ...includeDeletedMetaBase,
        schema: { type: "integer", minimum: 0, maximum: 1 }
      };

    switch (name) {
      case "getManyBase":
        return options.query.softDelete
          ? [
            fieldsMeta,
            searchMeta,
            filterMeta,
            orMeta,
            sortMeta,
            joinMeta,
            limitMeta,
            offsetMeta,
            pageMeta,
            cacheMeta,
            includeDeletedMeta
          ]
          : [
            fieldsMeta,
            searchMeta,
            filterMeta,
            orMeta,
            sortMeta,
            joinMeta,
            limitMeta,
            offsetMeta,
            pageMeta,
            cacheMeta
          ];
      case "getOneBase":
        return options.query.softDelete
          ? [fieldsMeta, joinMeta, cacheMeta, includeDeletedMeta]
          : [fieldsMeta, joinMeta, cacheMeta];
      default:
        return [];
    }
  }

  static getQueryParamsNames(): any {
    const name = (n) => {
      return `${n}`;
    };

    return {
      delim: "qbOptions.delim",
      delimStr: "qbOptions.delimStr",
      fields: name("fields"),
      search: name("search"),
      filter: name("filter"),
      or: name("or"),
      join: name("join"),
      sort: name("sort"),
      limit: name("limit"),
      offset: name("offset"),
      page: name("page"),
      cache: name("cache"),
      includeDeleted: name("includeDeleted")
    };
  }

  private static getSwaggerVersion(): number {
    return swaggerPkgJson ? parseInt(swaggerPkgJson.version[0], 10) : /* istanbul ignore next */ 3;
  }
}


export function ApiProperty(options?: any): PropertyDecorator {
  return (target: unknown, propertyKey: string | symbol) => {
    /* istanbul ignore else */
    if (swagger) {
      // tslint:disable-next-line
      const ApiPropertyDecorator = swagger.ApiProperty // || /* istanbul ignore next */ {} // swagger.ApiModelProperty;
      // tslint:disable-next-line
      ApiPropertyDecorator(options)(target, propertyKey);
    }
  };
}
