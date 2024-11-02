import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('system:module模块管理')
@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @ApiOperation({ summary: '模块管理-添加' })
  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @ApiOperation({ summary: '模块管理-查询' })
  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  @ApiOperation({ summary: '模块管理-单条查询' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(+id);
  }

  @ApiOperation({ summary: '模块管理-更新' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(+id, updateModuleDto);
  }

  @ApiOperation({ summary: '模块管理-删除' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(+id);
  }
}
