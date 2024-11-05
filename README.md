## 配置管理

## redis缓存


## swagger文档
```shell
yarn add @nestjs/swagger @nestjs/platform-express
```

## 表结构生成模型
```shell
yarn add -D typeorm-model-generator
```

## mysql数据库连接
```shell
yarn add @nestjs/typeorm mysql2 uuid typeorm
```


## 请求参数校验
```shell
yarn add class-transformer class-validator
```


## 日志记录
```shell
yarn add winston winston-daily-rotate-file nest-winston chalk
```
``` 
winston：一个通用的日志记录库，为 Node.js 应用提供灵活的日志记录功能
nest-winston: 一个用于 winston 的 Nest 模块包装器
winston-daily-rotate-file: 用于将日志文件按天轮换保存
chalk: 用于在终端中输出带有颜色的文本
```



## 配置热重载 HMR
```shell
yarn add -D webpack-node-externals run-script-webpack-plugin webpack
```

``` 
入口文件修改
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

启动命令修改
"start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
```



## 类型文件安装
```shell
yarn add -D @types/node @types/lodash
```


## 启动错误

``
[Nest] 584  - 2024/11/02 18:22:43   ERROR [NestApplication] Error: listen EADDRINUSE: address already in use 0.0.0.0:4100 +18ms
``

## swagger装饰器

```
还需要手动加一些装饰器来标注：

ApiOperation：声明接口信息
ApiResponse：声明响应信息，一个接口可以多种响应
ApiQuery：声明 query 参数信息
ApiParam：声明 param 参数信息
ApiBody：声明 body 参数信息，可以省略
ApiProperty：声明 dto、vo 的属性信息
ApiPropertyOptional：声明 dto、vo 的属性信息，相当于 required: false 的 ApiProperty
ApiTags：对接口进行分组
ApiBearerAuth：通过 jwt 的方式认证，也就是 Authorization: Bearer xxx
ApiCookieAuth：通过 cookie 的方式认证
ApiBasicAuth：通过用户名、密码认证，在 header 添加 Authorization: Basic xxx
```
