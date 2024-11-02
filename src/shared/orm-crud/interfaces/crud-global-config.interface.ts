import { ParamsOptions, RequestQueryBuilderOptions } from "../crud-request";


export interface CrudGlobalConfig {
  queryParser?: RequestQueryBuilderOptions;
  auth?: any;
  routes?: any;
  params?: ParamsOptions;
  query?: {
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
    alwaysPaginate?: boolean;
    softDelete?: boolean;
  };
  serialize?: {
    getMany?: false;
    get?: false;
    create?: false;
    createMany?: false;
    update?: false;
    replace?: false;
    delete?: false;
    recover?: false;
  };
}
