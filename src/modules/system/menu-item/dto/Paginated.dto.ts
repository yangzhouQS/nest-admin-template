import { ApiProperty } from '@nestjs/swagger';

class MetaType {
  @ApiProperty({
    description: '查询的总条数',
  })
  totalItems: number;

  @ApiProperty({
    description: '当前查询的条数',
    example: 10,
  })
  itemCount: number;

  @ApiProperty({
    description: '每页请求的项目数量',
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: '总页码',
  })
  totalPages: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  currentPage: number;
}

export class PaginatedDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty({
    name: 'meta',
    description: '分页信息',
    type: () => MetaType,
  })
  meta: MetaType;

  @ApiProperty({ name: 'count', description: '总条数' })
  count: number;

  items: T[];
}
