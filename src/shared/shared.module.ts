import {Global, Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {RedisModule} from './redis/redis.module';
import {ScheduleModule} from '@nestjs/schedule';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {ThrottlerModule} from '@nestjs/throttler';
import {PrismaModule} from './prisma/prisma.module';

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
  providers: [],
  exports: [HttpModule, RedisModule, PrismaModule],
})
export class SharedModule {
}
