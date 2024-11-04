import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SMenuItemEntity } from '../../../entities/system-modules';
import { Repository } from 'typeorm';
import { TypeOrmCurdService } from '../../../shared/orm-crud';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from '../../../shared/typeorm-paginate';

@Injectable()
export class MenuItemService extends TypeOrmCurdService<SMenuItemEntity> {
  constructor(
    @InjectRepository(SMenuItemEntity)
    private readonly menuItemRepository: Repository<SMenuItemEntity>,
  ) {
    super(menuItemRepository);
  }

  create(createMenuItemDto: CreateMenuItemDto) {
    return 'This action adds a new menuItem';
  }

  page(options: IPaginationOptions): Promise<Pagination<SMenuItemEntity>> {
    const builder = this.menuItemRepository.createQueryBuilder('c');
    builder.orderBy('c.id', 'DESC');
    return paginate<SMenuItemEntity>(builder, options);
  }
}
