import { Injectable } from '@nestjs/common';
import { CreatePlatformLogDto } from './dto/create-platform-log.dto';
import { UpdatePlatformLogDto } from './dto/update-platform-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../../../decorators';
import { SPlatformLogEntity } from '../../../entities/system-modules';

@Injectable()
export class PlatformLogService {
  constructor(
    @InjectRepository(SPlatformLogEntity)
    private readonly platformLogRepo: Repository<SPlatformLogEntity>,
  ) {}
  create(createPlatformLogDto: CreatePlatformLogDto) {
    return 'This action adds a new platformLog';
  }

  findAll() {
    return `This action returns all platformLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} platformLog`;
  }

  update(id: number, updatePlatformLogDto: UpdatePlatformLogDto) {
    return `This action updates a #${id} platformLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} platformLog`;
  }

  public queryParams(pagination: Pagination) {
    return pagination.apply(this.platformLogRepo, 10001);
  }
}
