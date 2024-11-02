import { Controller, Get } from '@nestjs/common';
import { ServeMonitoringService } from './serve-monitoring.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServeStatInfo } from './serve.model';

@ApiTags('system:serve-monitoring 服务监控')
@Controller('serve-monitoring')
export class ServeMonitoringController {
  constructor(
    private readonly serveMonitoringService: ServeMonitoringService,
  ) {}

  @Get('stat')
  // @ApiResult({ type: ServeStatInfo })
  @ApiOperation({ summary: '获取服务器运行信息' })
  async stat(): Promise<ServeStatInfo> {
    return this.serveMonitoringService.getServeStat();
  }
}
