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
[Nest] 584 - 2024/11/02 18:22:43   ERROR [NestApplication] Error: listen EADDRINUSE: address already in use 0.0.0.0:4100 +18ms
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

## swagger
### 安装
```shell 
yarn add @nestjs/swagger swagger-ui-express
```

### swagger常用装饰器
| 装饰器                 | 描述                              | 使用场景                              |
|---------------------|---------------------------------|-----------------------------------|
| @ApiTags            | 为控制器或方法添加标签，用于组织 Swagger UI 文档。 | 标明控制器或方法所属的领域，使文档更易于组织。           |
| @ApiOperation       | 为控制器方法添加操作描述，包括摘要和详细描述。         | 提供关于 API 操作的清晰说明，方便开发者理解 API 的作用。 |
| @ApiParam           | 描述路径参数、请求参数或响应参数，包括名称、类型、描述等。   | 提供详细的参数信息，方便开发者正确使用和理解 API。       |
| @ApiBody            | 指定请求体的 DTO 类型，用于描述请求体的结构。       | 明确请求体的结构，帮助开发者正确发送请求。             |
| @ApiResponse        | 描述 API 的响应，包括状态码、描述等。           | 提供关于 API 响应的详细说明，方便开发者处理各种响应情况。   |
| @ApiBearerAuth      | 指定请求需要携带 Bearer Token，用于身份验证。   | 在需要身份验证的接口中使用，指定需要提供 Token 信息。    |
| @ApiProperty        | 为 DTO 类型的属性添加元数据，如描述、默认值等。      | 提供详细的属性信息，使开发者了解 DTO 对象的结构和约束。    |
| @ApiQuery           | 描述查询参数，包括名称、类型、描述等。             | 用于标识查询参数，使开发者清晰了解 API 的可用查询选项。    |
| @ApiHeader          | 描述请求头信息，包括名称、类型、描述等。            | 提供请求头的详细信息，使开发者正确设置请求头。           |
| @ApiExcludeEndpoint | 标记一个控制器方法不在 Swagger UI 中显示。     | 在一些特殊情况下，可以使用该装饰器排除不需要在文档中展示的接口。  |

### DocumentBuilder常用的属性配置

| 方法                                                       | 描述                         |
| ---------------------------------------------------------- | ---------------------------- |
| setTitle(title: string)                                    | 设置文档标题。               |
| setDescription(description: string)                        | 设置文档描述。               |
| setVersion(version: string)                                | 设置文档版本。               |
| setTermsOfService(termsOfService: string)                  | 设置文档服务条款。           |
| setContact(name: string, url: string, email: string)       | 设置文档联系信息。           |
| setLicense(name: string, url: string)                      | 设置文档许可证信息。         |
| setExternalDoc(description: string, url: string)           | 设置外部文档链接。           |
| addBearerAuth(options: AddBearerAuthOptions, name: string) | 添加 Bearer Token 认证配置。 |
| addApiKey(options: AddApiKeyOptions, name: string)         | 添加 API Key 认证配置。      |
| addOAuth2(options: AddOAuth2Options, name: string)         | 添加 OAuth2 认证配置。       |


