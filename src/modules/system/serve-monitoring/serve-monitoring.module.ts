import { Module } from '@nestjs/common';
import { ServeMonitoringService } from './serve-monitoring.service';
import { ServeMonitoringController } from './serve-monitoring.controller';

@Module({
  controllers: [ServeMonitoringController],
  providers: [ServeMonitoringService],
})
export class ServeMonitoringModule {}
