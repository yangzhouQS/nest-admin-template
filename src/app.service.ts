import { Inject, Injectable } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import databaseConfig from "./config/database.config";

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    @Inject(databaseConfig.KEY)
    private readonly database: ConfigType<typeof databaseConfig>,
  ) {}

  getHello(): any {
    // type getType<T extends () => any> = T extends () => infer R ? R : T;
    // type f = typeof databaseConfig;
    // type databaseConfigType = getType<typeof databaseConfig>;

    console.log(this.database.host, this.database.port);
    console.log(this.config.get("app"));
    console.log(this.config.get("APP_NAME"));
    return {
      db_port: this.database.port,
      db_host: this.database.host,
      message: "Hello World!",
    };
  }
}
