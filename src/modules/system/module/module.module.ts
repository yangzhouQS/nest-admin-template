import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SModuleEntity,
  SPermissionEntryEntity,
} from '../../../entities/system-modules';

@Module({
  imports: [TypeOrmModule.forFeature([SModuleEntity, SPermissionEntryEntity])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
