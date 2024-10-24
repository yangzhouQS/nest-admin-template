import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [SharedModule, SystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
