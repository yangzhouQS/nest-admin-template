
## 安装所需包
```shell
$ pnpm i prisma@6.0.1 -D
$ pnpm i @prisma/client@6.0.1

```

## 初始化
```shell
$ npx prisma init
```
## 连接数据库
> .env配置文件
```shell
    DATABASE_URL="mysql://root:root@localhost:3306/nest-blog"
    #定义环境
    NODE_ENV=development
```
## 迁移文件
迁移文件migrate用于构建数据表结构变化，他是数据库的版本控制机制，每次表结构的修改都有单独文件记录。

## 结构定义
``` 
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }

    model user {
      //BigInt类型	主键 自增值	非负BitInt
      id       BigInt    @id @default(autoincrement()) @db.UnsignedBigInt()
      //字符串，默认为varchar(191)
      email    String
      password String
      //添加时自动设置时间，即设置Mysql默认值为CURRENT_TIMESTAMP
      createdAt DateTime @default(now())
      // 让Prisma在添加与更新时自动维护该字段
      updatedAt DateTime @updatedAt
    }

```


## 生成迁移

### 手动迁移
要将数据模型映射到数据库模式(即创建相应的数据库表)，你需要使用 prisma migrate CLI 命令
```shell
npx prisma migrate dev --name init
```
该命令做了两件事：
- 它为此迁移创建一个新的 SQL 迁移文件
- 它针对数据库运行 SQL 迁移文件

该命令执行动作为：
- 根据定义生成迁移文件
- 执行新的迁移文件修改数据表
- 生成 Prisma Client

### 自动迁移
执行以下命令，将自动根据已经存在的数据库生成文件 prisman/schema.prisma ，而不需要向上面一样手动定义。
``` shell
npx prisma db pull
```

## 安装客户端
```shell
npx prisma generate
```
客户端提供众多方法完成对数据的增删改查
你可以查看文档 prisma-client了解详细使用

## 更新表结构
使用  db push 来改变现有的原型架构，例如在某一个表中新增某个字段
```shell
npx prisma db push
```

## 重置数据库
如果你是使用自动迁移的方法导入映射关系，请确保你的数据留有备份，执行此操作在没有数据迁移记录的情况下，可能导致数据丢失。

通过运行以下命令自行 重置 数据库以撤消手动更改或  db push 的实验:
```shell
npx prisma migrate reset
```
该命令执行动作为:
 - 如果环境允许，则删除数据库；如果环境不允许删除数据库，则执行软重置。
 - 如果数据库被删除，则创建相同名称的新数据库。
 - 适用于所有迁移。
 - 运行种子脚本。


## 配置log日志输出



