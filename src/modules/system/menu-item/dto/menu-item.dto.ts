import { ApiProperty } from '@nestjs/swagger';

export class MenuItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  originalId: string;

  @ApiProperty()
  moduleId: number;

  @ApiProperty()
  parentId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  sortNum: number;

  @ApiProperty()
  isDisabled: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  urlParams: string;

  @ApiProperty()
  isRemoved: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
