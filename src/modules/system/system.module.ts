import { Module } from '@nestjs/common';
import { ModuleModule } from './module/module.module';
import { PlatformLogModule } from './platform-log/platform-log.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { ServeMonitoringModule } from './serve-monitoring/serve-monitoring.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ModuleModule,
    // PlatformLogModule,
    MenuItemModule,
    ServeMonitoringModule,
    AuthModule,
  ],
})
export class SystemModule {}
