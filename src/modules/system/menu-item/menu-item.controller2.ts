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
import {
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
} from '@nestjs/swagger';
import { OrmCrud } from '../../../shared/orm-crud';
import { OrmCrudController } from '../../../shared/orm-crud/interfaces/orm-crud-controller.interface';
import { SMenuItemEntity } from '../../../entities/system-modules';
import { Pagination } from '../../../shared/typeorm-paginate';
import { PaginatedDto } from './dto/Paginated.dto';
import { MenuItemDto } from './dto/menu-item.dto';
import { ApiPaginatedResponse } from '../../../decorators/api-paginated-response.decorate';

@OrmCrud({
  tags: ['system:menu菜单管理'],
  model: {
    type: SMenuItemEntity,
  },
  // validation: false,
  /*params: {
    uid: { // uid
      field: "uid", // 字段
      type: "uuid", // 类型
      primary: true, // 是否为主键
      disabled: false // 是否禁用
    }
  }*/
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
@ApiExtraModels(PaginatedDto, MenuItemDto)
// @Controller("menu-item")
/*@Controller({
  // prefix: ["menu-itemxx"],
  path: "menu-item-2",
  version: "1",
  host: ["http://127.0.0.1:3000", "https://nestjs.com"],

})*/
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
  @ApiExtraModels()
  /*@ApiOkResponse({
    description: '分页查询返回数据',
    // type: Pagination<SMenuItemEntity>,
    schema: {
      allOf: [
        //allOf 是 OAS 3 提供的概念，用于涵盖各种与继承相关的用例。
        { $ref: getSchemaPath(PaginatedDto) },
        // 由于你并没有直接绑定 PaginatedDto 所以你需要把这个 model加到 ApiExtraModels 中去
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(MenuItemDto) },
            },
          },
        },
      ],
    },
  })*/
  @ApiPaginatedResponse(MenuItemDto)
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
  @ApiParam({
    type: Number,
    name: 'orgId',
    description: '机构id',
    required: true,
    example: 10086,
  })
  @Post('/page/:orgId')
  async page(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    console.log('orgId = ', orgId);
    return this.menuItemService.page({
      page,
      limit,
      // route: 'http://cat.com/menus',
    });
  }
}
