import { RequestQueryBuilderOptions } from './interfaces';

export class RequestQueryBuilder {
  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      fields: ['fields', 'select'],
      search: 's',
      filter: 'filter',
      or: 'or',
      join: 'join',
      sort: 'sort',
      limit: ['limit', 'per_page'],
      offset: 'offset',
      page: 'page',
      cache: 'cache',
      includeDeleted: 'include_deleted',
    },
  };

  public queryObject: { [key: string]: any } = {};

  public queryString: string;

  static setOptions(options: RequestQueryBuilderOptions) {
    RequestQueryBuilder._options = {
      ...RequestQueryBuilder._options,
      ...options,
      paramNamesMap: {
        ...RequestQueryBuilder._options.paramNamesMap,
        ...Object.assign(options.paramNamesMap || {}),
      },
    };
  }
}
