import { OrmCrudServiceAbstract } from '../services/orm-crud-service.abstract';
import { CrudRequest } from './crud-request.interface';

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
}
