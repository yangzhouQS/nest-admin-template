import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlatformLogService } from './platform-log.service';
import { CreatePlatformLogDto } from './dto/create-platform-log.dto';
import { UpdatePlatformLogDto } from './dto/update-platform-log.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPagination } from '../../../decorators';

@ApiTags('system:platform_log平台日志')
@Controller('platform-log')
export class PlatformLogController {
  constructor(private readonly platformLogService: PlatformLogService) {}

  @Post()
  create(@Body() createPlatformLogDto: CreatePlatformLogDto) {
    return this.platformLogService.create(createPlatformLogDto);
  }

  @ApiOperation({ summary: '分页查询' })
  @Post('/query-params')
  queryParams(@GetPagination() pagination) {
    return this.platformLogService.queryParams(pagination);
  }

  @Get()
  findAll() {
    return this.platformLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformLogService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlatformLogDto: UpdatePlatformLogDto,
  ) {
    return this.platformLogService.update(+id, updatePlatformLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformLogService.remove(+id);
  }
}
