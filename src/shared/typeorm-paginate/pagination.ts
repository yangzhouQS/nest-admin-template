import { IPaginationLinks, IPaginationMeta, ObjectLiteral } from './interfaces';

/**
 * 返回数据结构
 */
export class Pagination<
  PaginationObject,
  T extends ObjectLiteral = IPaginationMeta,
> {
  /**
   * 总条数
   */
  public count: number = 0;
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: T,
    /**
     * associated links
     */
    public readonly links?: IPaginationLinks,
  ) {
    this.count = this.meta.totalItems;
  }
}
