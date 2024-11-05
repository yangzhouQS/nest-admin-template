import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { OrmCrud } from '../../../shared/orm-crud';
import { OrmCrudController } from '../../../shared/orm-crud/interfaces/orm-crud-controller.interface';
import { SMenuItemEntity } from '../../../entities/system-modules';
import { Pagination } from '../../../shared/typeorm-paginate';

@OrmCrud({
  tags: ['system:menu菜单管理'],
  /*routes: {
    only: [],
    exclude: [],

    getManyBase?: {
      interceptors?: [],
      decorators?: [],

      interceptors -自定义拦截器的数组
      decorators -自定义装饰器的数组
      allowParamsOverride -是否允许PATH请求上的URL参数覆盖正文数据。默认值：false
      returnObject-是否应该在响应请求的响应体中返回实体对象。默认值：false returnShallow -是否返回浅实体
    },
    getOneBase?: {
      interceptors?: [],
      decorators?: [],
    },
  },*/
  // validate: false,
  // model: SMenuItemEntity,
  // params: {},
  // query: {}
})
@Controller('menu-item')
export class MenuItemController implements OrmCrudController<SMenuItemEntity> {
  constructor(
    public readonly ormService: MenuItemService,
    private readonly menuItemService: MenuItemService,
  ) {
    // console.log('MenuItemController', this);
  }

  @ApiOperation({ summary: '创建菜单' })
  @Post('/create-menu')
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @ApiOperation({ summary: '分页查询' })
  @ApiOkResponse({
    description: '分页查询返回数据',
    // type: Pagination<SMenuItemEntity>,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/SMenuItemEntity' },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '页码',
    example: 1,
    schema: {
      type: 'number',
      default: 1,
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '页大小',
    example: 10,
    schema: {
      type: 'number',
      default: 10,
    },
  })
  @Post('/page')
  async page(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.menuItemService.page({
      page,
      limit,
      // route: 'http://cat.com/menus',
    });
  }
}
