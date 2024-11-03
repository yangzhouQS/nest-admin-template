import { OrmCrudServiceAbstract } from '../services/orm-crud-service.abstract';
import { CrudRequest } from './crud-request.interface';
import { GetManyDefaultResponse } from "./get-many-default-response.interface";


export interface CreateManyDto<T = any> {
  bulk: T[];
}

/**
 * OrmCurdController 基础接口
 */
export interface OrmCrudController<T> {
  ormService: OrmCrudServiceAbstract<T>;

  /**
   * controller 单条查询
   * @param {CrudRequest} req
   * @returns {Promise<T>}
   */
  getOneBase?(req: CrudRequest): Promise<T>;

  /**
   * controller 多条查询
   * @param {CrudRequest} req
   * @returns {Promise<T>}
   */
  getManyBase?(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;

  /**
   * controller 单条创建
   * @param {CrudRequest} req
   * @param {T} dto
   * @returns {Promise<T>}
   */
  createOneBase?(req: CrudRequest, dto: T): Promise<T>;

  /**
   * controller 多条创建
   * @param {CrudRequest} req
   * @param {CreateManyDto<T>} dto
   * @returns {Promise<T[]>}
   */
  createManyBase?(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]>;
}
