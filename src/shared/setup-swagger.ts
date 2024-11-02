import { NestExpressApplication } from "@nestjs/platform-express";
// api文档插件
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app:NestExpressApplication) => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('后台管理接口')
    .setDescription('使用nest书写的常用性接口') // 文档介绍
    .setVersion('1.0.0') // 文档版本
    .setLicense('MIT 百度', 'https://www.baidu.com/')
    .setExternalDoc('扩展文档', 'https://www.baidu.com/')
    .addTag('后台管理接口项目') // 每个tag标签都可以对应着几个@ApiUseTags('用户,安全') 然后被ApiUseTags注释，字符串一致的都会变成同一个标签下的
    .build();

  // 为了创建完整的文档（具有定义的HTTP路由），我们使用类的createDocument()方法SwaggerModule。此方法带有两个参数，分别是应用程序实例和基本Swagger选项。
  const document = SwaggerModule.createDocument(app, options, );
  // 最后一步是setup()。它依次接受（1）装入Swagger的路径，（2）应用程序实例, （3）描述Nest应用程序的文档。
  SwaggerModule.setup('/api-doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
