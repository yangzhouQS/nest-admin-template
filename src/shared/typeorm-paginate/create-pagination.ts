import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptionsRoutingLabels,
  ObjectLiteral,
} from './interfaces';
import { Pagination } from './pagination';

/**
 * 创建一个分页对象
 *
 * @param param0 分页参数对象
 * @returns 分页对象
 *
 * @template T 数据类型
 * @template CustomMetaType 自定义元数据类型，继承自ObjectLiteral，默认为IPaginationMeta
 */
export function createPaginationObject<
  T,
  CustomMetaType extends ObjectLiteral = IPaginationMeta,
>({
  items,
  totalItems,
  currentPage,
  limit,
  route,
  metaTransformer,
  routingLabels,
}: {
  items: T[];
  totalItems?: number;
  currentPage: number;
  limit: number;
  route?: string;
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
  routingLabels?: IPaginationOptionsRoutingLabels;
}): Pagination<T, CustomMetaType> {
  const totalPages =
    totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined;

  const hasFirstPage = route;
  const hasPreviousPage = route && currentPage > 1;
  const hasNextPage =
    route && totalItems !== undefined && currentPage < totalPages;
  const hasLastPage = route && totalItems !== undefined && totalPages > 0;

  const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';

  const limitLabel =
    routingLabels && routingLabels.limitLabel
      ? routingLabels.limitLabel
      : 'limit';

  const pageLabel =
    routingLabels && routingLabels.pageLabel ? routingLabels.pageLabel : 'page';

  const routes: IPaginationLinks =
    totalItems !== undefined
      ? {
          first: hasFirstPage ? `${route}${symbol}${limitLabel}=${limit}` : '',
          previous: hasPreviousPage
            ? `${route}${symbol}${pageLabel}=${
                currentPage - 1
              }&${limitLabel}=${limit}`
            : '',
          next: hasNextPage
            ? `${route}${symbol}${pageLabel}=${
                currentPage + 1
              }&${limitLabel}=${limit}`
            : '',
          last: hasLastPage
            ? `${route}${symbol}${pageLabel}=${totalPages}&${limitLabel}=${limit}`
            : '',
        }
      : undefined;

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: currentPage,
  };

  const links = route ? routes : undefined;

  if (metaTransformer) {
    return new Pagination<T, CustomMetaType>(
      items,
      metaTransformer(meta),
      links,
    );
  }

  // @ts-ignore
  return new Pagination<T, CustomMetaType>(items, meta, links);
}
