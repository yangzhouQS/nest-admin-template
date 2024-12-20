import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

export interface Pagination {
  page?: number;
  skip?: number;
  limit?: number;
  sort?: { field: string; by: 'ASC' | 'DESC' }[];
  search?: { field: string; value: string }[];
  apply<T>(
    repo: Repository<T>,
    options?: any,
  ): Promise<{
    data: Repository<T>[];
    count: number;
    total: number;
    currentPage: number;
  }>;
}

const applyPagination = async <T>(
  pagination: Pagination,
  repo: Repository<T>,
  options?: any,
): Promise<any> => {
  const where = [];

  // or
  for (const search of pagination.search) {
    if (search) {
      where.push({
        [search.field]:
          search.field === 'phone'
            ? Like('%' + search.value + '%')
            : Like(search.value + `%`),
      });
    }
  }

  // and
  // to implement

  // fallback
  if (where.length === 0) {
    // where.push({ companyId });
  }

  const [result, total] = await Promise.all([
    repo
      .find({
        where: where,
        order: pagination.sort.reduce(
          (order, sort) => ({ ...order, [sort.field]: sort.by }),
          {},
        ),
        skip: pagination.skip,
        take: pagination.limit,
      })
      .catch((e) => {
        console.log('applyPagination', where);
        console.error(e);
        return [];
      }),
    repo.count({
      cache: {
        id: repo.metadata.tableName,
        milliseconds: 300000,
      },
      where: where,
    }),
  ]);

  return {
    page: pagination.skip,
    count: result.length,
    data: result,
    total: total,
  };
};

export const GetPagination = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: any /*Request*/ = ctx.switchToHttp().getRequest();
    const query = req['query'] || req.body;
    const search = query.search || query.searchValue || query.searchTerm;

    const paginationParams: Pagination = {
      page: (query.page > 0 ? query.page : 1) || 1,
      skip: 0,
      limit: query.limit ? parseInt(query.limit) : 15,
      sort: [],
      search: [],
      apply<T>(repo: Repository<T>, options: any) {
        return applyPagination(this, repo, options);
      },
    };

    paginationParams.skip =
      (paginationParams.page - 1) * paginationParams.limit;

    // create array of sort
    if (query.sort) {
      const sortArray = query.sort.toString().split(',');
      paginationParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem[0];
        switch (sortBy) {
          case '-':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          case '+':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          default:
            return {
              field: sortItem.trim(),
              by: 'DESC',
            };
        }
      });
    }

    // create array of search
    if (search) {
      // refactorize by

      const searchArray = search.toString().split(',');
      paginationParams.search = searchArray.map((searchItem) => {
        let field = searchItem.split(':')[0];
        let value = searchItem.split(':')[1];

        if ((value === undefined && field) || field == 'all') {
          value = value || field;
          field = null;
        }

        return {
          field,
          value,
        };
      });
      paginationParams.search = paginationParams.search.filter((a) => a.value);
    }

    return paginationParams;
  },
);
