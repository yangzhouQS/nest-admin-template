import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SModuleEntity } from "../../../entities/system-modules";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(SModuleEntity)
    private readonly moduleRepository: Repository<SModuleEntity>,
  ) {}
  create(dto: CreateModuleDto) {
    console.log(dto);
    return 'This action adds a new module';
  }

  async findAll() {
    return await this.moduleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
