export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface IPaginationOptions<CustomMetaType = IPaginationMeta> {
  /**
   * 每页查询大小
   * @default 10
   * the amount of items to be requested per page
   */
  limit: number | string;

  /**
   * 查询页码
   * @default 1
   * the page that is requested
   */
  page: number | string;

  /**
   * 自定义路由
   * 一个用于生成链接的基本路由（即不包含查询参数）
   * a basic route for generating links (i.e., WITHOUT query params)
   */
  route?: string;

  /**
   * 用于将默认元数据转换为自定义类型
   * For transforming the default meta data to a custom type
   */
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;

  /**
   * 用于在链接中附加的路由标签（限制和/或页码）
   * routingLabels for append in links (limit or/and page)
   */
  routingLabels?: IPaginationOptionsRoutingLabels;

  /**
   * @default PaginationTypeEnum.LIMIT
   * 用于更改查询方法以使用take/skip（如果没有提供参数，则默认为limit/offset）
   * Used for changing query method to take/skip (defaults to limit/offset if no argument supplied)
   */
  paginationType?: PaginationTypeEnum;

  /**
   * @default true
   * 关闭分页计数总查询。itemCount, totalItems, itemsPerPage 和 totalPages 将为 undefined
   * Turn off pagination count total queries. itemCount, totalItems, itemsPerPage and totalPages will be undefined
   */
  countQueries?: boolean;

  /**
   * @default false
   * @link https://orkhan.gitbook.io/typeorm/docs/caching
   * 启用或禁用查询结果缓存
   * Enables or disables query result caching.
   */
  cacheQueries?: TypeORMCacheType;
}

export type TypeORMCacheType =
  | boolean
  | number
  | {
      id: any;
      milliseconds: number;
    };

export interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * 当前查询的条数
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * 查询的总条数
   * the total amount of items
   */
  totalItems?: number;
  /**
   * 每页请求的项目数量
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * 总页码
   * the total amount of pages in this paginator
   */
  totalPages?: number;
  /**
   * 当前页
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export interface IPaginationLinks {
  /**
   * 指向“第一页”的链接
   */
  first?: string;
  /**
   * 指向“前一页”的链接
   */
  previous?: string;
  /**
   * 指向“下一页”的链接
   */
  next?: string;
  /**
   * 指向“最后一页”的链接
   */
  last?: string;
}

export interface IPaginationOptionsRoutingLabels {
  /**
   * 路由字符串中要附加的限制文本
   */
  limitLabel?: string;

  /**
   * 路由字符串中要附加的页码文本
   */
  pageLabel?: string;
}
