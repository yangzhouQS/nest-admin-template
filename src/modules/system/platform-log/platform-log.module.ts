import { Module } from '@nestjs/common';
import { PlatformLogService } from './platform-log.service';
import { PlatformLogController } from './platform-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SPlatformLogEntity } from '../../../entities/system-modules';

@Module({
  imports: [TypeOrmModule.forFeature([SPlatformLogEntity])],
  controllers: [PlatformLogController],
  providers: [PlatformLogService],
})
export class PlatformLogModule {}
