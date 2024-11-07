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

## Nest 全部的装饰器
``` 
@Module： 声明 Nest 模块
@Controller：声明模块里的 controller
@Injectable：声明模块里可以注入的 provider
@Inject：通过 token 手动指定注入的 provider，token 可以是 class 或者 string
@Optional：声明注入的 provider 是可选的，可以为空
@Global：声明全局模块
@Catch：声明 exception filter 处理的 exception 类型
@UseFilters：路由级别使用 exception filter
@UsePipes：路由级别使用 pipe
@UseInterceptors：路由级别使用 interceptor
@SetMetadata：在 class 或者 handler 上添加 metadata
@Get、@Post、@Put、@Delete、@Patch、@Options、@Head：声明 get、post、put、delete、patch、options、head 的请求方式
@Param：取出 url 中的参数，比如 /aaa/:id 中的 id
@Query: 取出 query 部分的参数，比如 /aaa?name=xx 中的 name
@Body：取出请求 body，通过 dto class 来接收
@Headers：取出某个或全部请求头
@Session：取出 session 对象，需要启用 express-session 中间件
@HostParm： 取出 host 里的参数
@Req、@Request：注入 request 对象
@Res、@Response：注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true
@Next：注入调用下一个 handler 的 next 方法
@HttpCode： 修改响应的状态码
@Header：修改响应头
@Redirect：指定重定向的 url
@Render：指定渲染用的模版引擎
把这些装饰器用熟，就掌握了 nest 大部分功能了。
```



## 
