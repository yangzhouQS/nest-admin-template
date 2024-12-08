import { Controller } from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import {
  ApiExtraModels,
} from "@nestjs/swagger";
import { OrmCrudController } from "../../../shared/orm-crud/interfaces/orm-crud-controller.interface";
import { SMenuItemEntity } from "../../../entities/system-modules";
import { PaginatedDto } from "./dto/Paginated.dto";
import { MenuItemDto } from "./dto/menu-item.dto";
// import { OrmCrud } from "@fks/crud-typeorm";

/*@OrmCrud({
  tags: ["system:menu菜单管理"],
  model: {
    type: SMenuItemEntity
  }
})*/
@ApiExtraModels(PaginatedDto, MenuItemDto)
@Controller("menu-item")
export class MenuItemController implements OrmCrudController<SMenuItemEntity> {
  constructor(
    public readonly ormService: MenuItemService,
    private readonly menuItemService: MenuItemService
  ) {
  }
}
