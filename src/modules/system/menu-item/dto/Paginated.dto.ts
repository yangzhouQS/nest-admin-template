import { ApiProperty } from '@nestjs/swagger';

interface MetaType {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

function MetaType() {}

export class PaginatedDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty({
    name: 'meta',
    description: '分页信息',
    type: MetaType,
  })
  meta: MetaType;

  @ApiProperty({ name: 'count', description: '总条数' })
  count: number;

  items: T[];
}
