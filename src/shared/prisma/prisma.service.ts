import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });

    //@ts-ignore
    this.$on('query', async (e) => {
      //@ts-ignore
      let timestamp = new Date();
      //@ts-ignore
      let query = e.query;
      //@ts-ignore
      let params = JSON.parse(e.params);
      //@ts-ignore
      let duration = e.duration;
      console.log({
        Timestamp: timestamp,
        Query: query,
        Params: params,
        Duration: duration,
      });
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
