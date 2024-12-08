import {Global, Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {RedisModule} from './redis/redis.module';
import {ScheduleModule} from '@nestjs/schedule';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {ThrottlerModule} from '@nestjs/throttler';
import {PrismaModule} from './prisma/prisma.module';
import {PrismaService} from "./prisma/prisma.service";

@Global()
@Module({
  imports: [
    // http
    HttpModule,
    RedisModule,
    // schedule
    ScheduleModule.forRoot(),
    // rate limit
    ThrottlerModule.forRoot([
      {
        limit: 20,
        ttl: 60000,
      },
    ]),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService, HttpModule, RedisModule],
})
export class SharedModule {
}
