import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
@Global()
@Module({
  controllers: [],
  imports: [

  ],
  providers: [RedisService],
})
export class RedisModule {}
