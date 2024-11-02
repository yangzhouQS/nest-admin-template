import { OrmCrudServiceAbstract } from './orm-crud-service.abstract';
import { CrudRequest } from '../interfaces/crud-request.interface';
import { DataSourceOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { ClassType, ObjectLiteral } from '../../types';
import { filter, map } from 'lodash';
import { ParsedRequestParams } from '../crud-request';
import { CrudRequestOptions } from '../interfaces/crud-options.interface';

interface IAllowedRelation {
  alias?: string;
  nested: boolean;
  name: string;
  path: string;
  columns: string[];
  primaryColumns: string[];
  allowedColumns: string[];
}

export class TypeOrmCurdService<T> extends OrmCrudServiceAbstract<T> {
  /**
   * 连接数据库名称
   * @type {DataSourceOptions["type"]}
   * @protected
   */
  protected dbName: DataSourceOptions['type'];

  /**
   * 实体列名称
   * @type {string[]}
   * @protected
   */
  protected entityColumns: string[];

  protected entityPrimaryColumns: string[];

  protected entityHasDeleteColumn = false;

  protected entityColumnsHash: ObjectLiteral = {};

  protected entityRelationsHash: Map<string, IAllowedRelation> = new Map();
  constructor(protected repo: Repository<T>) {
    super();
    this.dbName = this.repo.metadata.connection.options.type;
    this.onInitMapEntityColumns();
  }

  public get findOne(): Repository<T>['findOne'] {
    return this.repo.findOne.bind(this.repo);
  }

  public get find(): Repository<T>['find'] {
    return this.repo.find.bind(this.repo);
  }

  public get count(): Repository<T>['count'] {
    return this.repo.count.bind(this.repo);
  }

  protected get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  /**
   * 获取实体别名(类名称)
   * @returns {string}
   * @protected
   */
  protected get alias(): string {
    return this.repo.metadata.targetName;
  }

  /**
   * Get one
   * @param req
   */
  public async getOne(req?: CrudRequest): Promise<T> {
    return this.getOneOrFail(req);
  }

  /**
   * 初始化实体列 映射配置
   * @protected
   */
  protected onInitMapEntityColumns() {
    const columns = this.repo.metadata.columns;
    this.entityColumns = map(columns, (prop) => {
      if (prop.embeddedMetadata) {
        this.entityColumnsHash[prop.propertyPath] = prop.databasePath;
        return prop.propertyPath as string;
      }
      this.entityColumnsHash[prop.propertyName] = prop.databasePath;
      return prop.propertyName as string;
    });

    this.entityPrimaryColumns = filter(columns, (prop) => prop.isPrimary).map(
      (prop) => prop.propertyName,
    );

    this.entityHasDeleteColumn =
      filter(columns, (prop) => prop.isDeleteDate).length > 0;
  }

  public async getOneOrFail(
    req: CrudRequest,
    shallow = false,
    withDeleted = false,
  ) {
    const { parsed, options } = req;
    const builder = this.repo.createQueryBuilder(this.alias);

    /*const builder = shallow
      ? this.repo.createQueryBuilder(this.alias)
      : this.repo.createQueryBuilder(parsed, options, true, withDeleted);*/

    if (shallow) {
      // x
    }
    const record = withDeleted
      ? await builder.withDeleted().getOne()
      : await builder.getOne();

    if (!record) {
      this.throwNotFoundException(this.alias);
    }

    return record;
  }

  public async createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
    withDeleted = false,
  ): Promise<any> {
    return {};
  }
}
