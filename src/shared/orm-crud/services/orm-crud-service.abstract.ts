import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CrudRequest } from '../interfaces/crud-request.interface';
import { GetManyDefaultResponse } from "../interfaces/get-many-default-response.interface";
import { CreateManyDto } from "../interfaces/orm-crud-controller.interface";

export abstract class OrmCrudServiceAbstract<T> {
  throwBadRequestException(msg?: unknown): BadRequestException {
    throw new BadRequestException(msg);
  }

  throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }

  /**
   * Wrap page into page-info
   * override this method to create custom page-info response
   * or set custom `serialize.getMany` dto in the controller's CrudOption
   * @param data
   * @param total
   * @param limit
   * @param offset
   */
  createPageInfo(data: T[], total: number, limit: number, offset: number): any {
    return {
      data,
      count: data.length,
      total,
      page: limit ? Math.floor(offset / limit) + 1 : 1,
      pageCount: limit && total ? Math.ceil(total / limit) : 1,
    };
  }


  abstract getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  abstract getOne(req: CrudRequest): Promise<T>;
  abstract createOne(req: CrudRequest, dto: T | Partial<T>): Promise<T>;
  abstract createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]>;
}
