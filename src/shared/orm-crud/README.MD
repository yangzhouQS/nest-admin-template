# 路由初始化流程





```ts
/**
   * 路由配置初始化
   * @private
   */
  private initCrudRoute() {
    const routesSchema = this.getRoutesSchema();

    /**
     * 合并配置
     */
    this.mergeOptions();

    /**
     * 设置返回模型
     */
    this.setResponseModels();

    /**
     * 创建路由
     */
    this.createRoutes(routesSchema);


    /**
     * 覆盖路由
     */
    this.overrideRoutes(routesSchema);

    /**
     * 启用路由
     */
    this.enableRoutes(routesSchema);
  }

```



## options合并



> this.options

```ts

{
  "validate": false,
  "params": {
    "id": {
      "field": "id",
      "type": "number",
      "primary": true
    }
  },
  "query": {},
  "auth": {},
  "routes": {
    "getManyBase": {
      "interceptors": [],
      "decorators": []
    },
    "getOneBase": {
      "interceptors": [],
      "decorators": []
    },
    "createOneBase": {
      "interceptors": [],
      "decorators": [],
      "returnShallow": false
    }
  },
  "dto": {},
  "serialize": {
    "delete": false
  }
}
```



## 创建swagger路由tags分组

```ts
  /**
   * 创建路由分组
   * @param metadata
   * @param func
   */
  static setControllerTags(metadata: unknown, func: any): void {
    if (DECORATORS){
      R.set(DECORATORS.API_TAGS, metadata, func);
    }
  }
```



## createRoutes 创建nest路由

```ts

```





### nest-swagger



```ts
export const DECORATORS_PREFIX = 'swagger';
export const DECORATORS = {
    
  // 接口装饰器 @ApiOperation({ summary: "创建菜单" })
  API_OPERATION: `${DECORATORS_PREFIX}/apiOperation`,
  API_RESPONSE: `${DECORATORS_PREFIX}/apiResponse`,
  API_PRODUCES: `${DECORATORS_PREFIX}/apiProduces`,
  API_CONSUMES: `${DECORATORS_PREFIX}/apiConsumes`,
    
  // 控制器装饰器 apiTgs()
  API_TAGS: `${DECORATORS_PREFIX}/apiUseTags`,
  API_CALLBACKS: `${DECORATORS_PREFIX}/apiCallbacks`,
  API_PARAMETERS: `${DECORATORS_PREFIX}/apiParameters`,
  API_HEADERS: `${DECORATORS_PREFIX}/apiHeaders`,
  API_MODEL_PROPERTIES: `${DECORATORS_PREFIX}/apiModelProperties`,
  API_MODEL_PROPERTIES_ARRAY: `${DECORATORS_PREFIX}/apiModelPropertiesArray`,
  API_SECURITY: `${DECORATORS_PREFIX}/apiSecurity`,
  API_EXCLUDE_ENDPOINT: `${DECORATORS_PREFIX}/apiExcludeEndpoint`,
  API_EXCLUDE_CONTROLLER: `${DECORATORS_PREFIX}/apiExcludeController`,
  API_EXTRA_MODELS: `${DECORATORS_PREFIX}/apiExtraModels`,
  API_EXTENSION: `${DECORATORS_PREFIX}/apiExtension`,
  API_SCHEMA: `${DECORATORS_PREFIX}/apiSchema`,
  API_DEFAULT_GETTER: `${DECORATORS_PREFIX}/apiDefaultGetter`,
  API_LINK: `${DECORATORS_PREFIX}/apiLink`
};
```







