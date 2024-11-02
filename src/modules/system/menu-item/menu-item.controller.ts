import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrmCrud } from '../../../shared/orm-crud';
import { OrmCrudController } from '../../../shared/orm-crud/interfaces/orm-crud-controller.interface';
import { SMenuItemEntity } from '../../../entities/system-modules';
import { CrudRequest } from '../../../shared/orm-crud/interfaces/crud-request.interface';

@ApiTags('system:menu菜单管理')
@OrmCrud({
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
  validate: false,
  model: SMenuItemEntity,
  params: {},
  query: {},
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
  @Post("/create-menu")
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

 /* @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.menuItemService.findOne(+id);
    return this.menuItemService.getOne();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(+id);
  }*/
}
