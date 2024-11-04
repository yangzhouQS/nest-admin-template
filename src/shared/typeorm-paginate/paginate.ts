import {
  Repository,
  FindManyOptions,
  SelectQueryBuilder,
  ObjectLiteral,
  FindOptionsWhere,
} from 'typeorm';
import { Pagination } from './pagination';
import {
  IPaginationMeta,
  IPaginationOptions,
  PaginationTypeEnum,
  TypeORMCacheType,
} from './interfaces';
import { createPaginationObject } from './create-pagination';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

/**
 * 对查询结果进行分页处理
 *
 * @param repository 实体类的仓库对象
 * @param options 分页选项
 * @param searchOptions 查询选项，可以是FindOptionsWhere或FindManyOptions类型
 * @returns 返回分页结果，类型为Pagination<T, CustomMetaType>
 */
export async function paginate<T, CustomMetaType = IPaginationMeta>(
  repository: Repository<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T, CustomMetaType>>;
export async function paginate<T, CustomMetaType = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T, CustomMetaType>>;

export async function paginate<T, CustomMetaType = IPaginationMeta>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T, CustomMetaType>(
        repositoryOrQueryBuilder,
        options,
        searchOptions,
      )
    : paginateQueryBuilder<T, CustomMetaType>(
        repositoryOrQueryBuilder,
        options,
      );
}

/**
 * 对原始查询构建器结果进行分页处理
 *
 * @template T 查询结果的类型
 * @template CustomMetaType 自定义元数据类型，默认值为IPaginationMeta
 * @param queryBuilder 查询构建器对象
 * @param options 分页选项
 * @returns 返回一个包含分页结果的Promise对象，类型为Pagination<T, CustomMetaType>
 */
export async function paginateRaw<
  T,
  CustomMetaType extends ObjectLiteral = IPaginationMeta,
>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T, CustomMetaType>> {
  const [page, limit, route, paginationType, countQueries, cacheOption] =
    resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    (paginationType === PaginationTypeEnum.LIMIT_AND_OFFSET
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheOption)
      .getRawMany<T>(),
    undefined,
  ];

  if (countQueries) {
    promises[1] = countQuery(queryBuilder, cacheOption);
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options.metaTransformer,
    routingLabels: options.routingLabels,
  });
}

/**
 * 对原始查询构建器结果进行分页处理，并同时返回分页结果和实体数据
 *
 * @template T 查询结果的类型
 * @template CustomMetaType 自定义元数据类型，默认值为IPaginationMeta
 * @param queryBuilder 查询构建器对象
 * @param options 分页选项
 * @returns 返回一个Promise对象，解析为一个包含分页结果和实体数据的数组，类型为[Pagination<T, CustomMetaType>, Partial<T>[]]
 */
export async function paginateRawAndEntities<
  T,
  CustomMetaType = IPaginationMeta,
>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<[Pagination<T, CustomMetaType>, Partial<T>[]]> {
  const [page, limit, route, paginationType, countQueries, cacheOption] =
    resolveOptions(options);

  const promises: [
    Promise<{ entities: T[]; raw: T[] }>,
    Promise<number> | undefined,
  ] = [
    (paginationType === PaginationTypeEnum.LIMIT_AND_OFFSET
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheOption)
      .getRawAndEntities<T>(),
    undefined,
  ];

  if (countQueries) {
    promises[1] = countQuery(queryBuilder, cacheOption);
  }

  const [itemObject, total] = await Promise.all(promises);

  return [
    createPaginationObject<T, CustomMetaType>({
      items: itemObject.entities,
      totalItems: total,
      currentPage: page,
      limit,
      route,
      metaTransformer: options.metaTransformer,
      routingLabels: options.routingLabels,
    }),
    itemObject.raw,
  ];
}

/**
 * 解析分页选项并返回一个包含分页参数的数组
 *
 * @param options 分页选项
 * @returns 一个包含分页参数的数组，依次为：页码、每页数量、路由、分页类型、是否计算总数量、是否缓存查询
 */
function resolveOptions(
  options: IPaginationOptions<any>,
): [number, number, string, PaginationTypeEnum, boolean, TypeORMCacheType] {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);
  const route = options.route;
  const paginationType =
    options.paginationType || PaginationTypeEnum.LIMIT_AND_OFFSET;
  const countQueries =
    typeof options.countQueries !== 'undefined' ? options.countQueries : true;
  const cacheQueries = options.cacheQueries || false;

  return [page, limit, route, paginationType, countQueries, cacheQueries];
}

function resolveNumericOption(
  options: IPaginationOptions<any>,
  key: 'page' | 'limit',
  defaultValue: number,
): number {
  const value = options[key];
  const resolvedValue = Number(value);

  if (Number.isInteger(resolvedValue) && resolvedValue >= 0)
    return resolvedValue;

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
  );
  return defaultValue;
}

async function paginateRepository<T, CustomMetaType = IPaginationMeta>(
  repository: Repository<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T, CustomMetaType>> {
  const [page, limit, route, paginationType, countQueries] =
    resolveOptions(options);

  if (page < 1) {
    return createPaginationObject<T, CustomMetaType>({
      items: [],
      totalItems: 0,
      currentPage: page,
      limit,
      route,
      metaTransformer: options.metaTransformer,
      routingLabels: options.routingLabels,
    });
  }

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions,
    }),
    undefined,
  ];

  if (countQueries) {
    promises[1] = repository.count({
      ...searchOptions,
    });
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options.metaTransformer,
    routingLabels: options.routingLabels,
  });
}

async function paginateQueryBuilder<T, CustomMetaType = IPaginationMeta>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
): Promise<Pagination<T, CustomMetaType>> {
  const [page, limit, route, paginationType, countQueries, cacheOption] =
    resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    (PaginationTypeEnum.LIMIT_AND_OFFSET === paginationType
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    )
      .cache(cacheOption)
      .getMany(),
    undefined,
  ];

  if (countQueries) {
    promises[1] = countQuery(queryBuilder, cacheOption);
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options.metaTransformer,
    routingLabels: options.routingLabels,
  });
}

const countQuery = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  cacheOption: TypeORMCacheType,
): Promise<number> => {
  const totalQueryBuilder = queryBuilder.clone();

  totalQueryBuilder
    .skip(undefined)
    .limit(undefined)
    .offset(undefined)
    .take(undefined)
    .orderBy(undefined);

  const { value } = await queryBuilder.connection
    .createQueryBuilder()
    .select('COUNT(*)', 'value')
    .from(`(${totalQueryBuilder.getQuery()})`, 'uniqueTableAlias')
    .cache(cacheOption)
    .setParameters(queryBuilder.getParameters())
    .getRawOne<{ value: string }>();

  return Number(value);
};
