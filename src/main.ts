import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./shared/setup-swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import Validate from "./common/validate";
import { TransformInterceptor } from "./common/transform.inteceptor";

BigInt.prototype["toJSON"] = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const port = 7100;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  // 替换日志器
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 显式的参数类型转换 // transform 指定为 true，这样会自动把参数的 js 对象转换为 dto 类型对象。
      // whitelist: false, // 如果设置为 true ，验证器将去掉没有使用任何验证装饰器的属性的验证（返回的）对象
      // enableDebugMessages: true, // 如果设置为 true ，验证器会在出问题的时候打印额外的警告信息
      // skipUndefinedProperties: true, // 如果设置为 true ，验证器将跳过对所有验证对象中值为 null 的属性的验证
      // skipNullProperties: true, // 如果设置为 true ，验证器将跳过对所有验证对象中值为 null 或 undefined 的属性的验证
      // skipMissingProperties: true, // 如果设置为 true ，验证器将跳过对所有验证对象中缺失的属性的验证
      // disableErrorMessage: true, // 如果设置为 true ,验证错误不会返回给客户端
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new Validate());

  setupSwagger(app);
  await app.listen(port, "0.0.0.0", async () => {
    const url = await app.getUrl();
    console.log(url);
    console.log(`${url}/api-doc`);
  });
}

bootstrap();
