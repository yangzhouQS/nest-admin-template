import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './modules/system/system.module';
const DBHOST = '127.0.0.1';

import * as entities from './entities/entity';
import { WinstonModule } from 'nest-winston';
import winstonLogger from './common/winston.config';

@Module({
  imports: [
    SharedModule,
    SystemModule,
    TypeOrmModule.forRoot({
      bigNumberStrings: false,
      dateStrings: true,
      debug: false,
      type: 'mysql',
      host: DBHOST,
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest_auth',
      entities: [...Object.values(entities)],
      synchronize: false,
      logging: true,
      timezone: '+08:00',
      /*extra: {
        timezone: 'Asia/Shanghai', // 设置时区为中国
      },*/
      charset: 'utf8mb4',
    }),
    WinstonModule.forRoot({
      level: 'info',
      transports: winstonLogger.transports,
      format: winstonLogger.format,
      defaultMeta: winstonLogger.defaultMeta,
      exitOnError: false, // 防止意外退出
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
