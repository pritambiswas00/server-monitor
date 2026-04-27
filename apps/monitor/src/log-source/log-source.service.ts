import { Injectable } from '@nestjs/common';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogSource } from './entities/log-source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogSourceService {


  constructor(@InjectRepository(LogSource) private logRepo: Repository<LogSource>){}

  create(createLogSourceDto: CreateLogSourceDto) {
    return 'This action adds a new logSource';
  }

  findAll() {
    return `This action returns all logSource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logSource`;
  }

  update(id: number, updateLogSourceDto: UpdateLogSourceDto) {
    return `This action updates a #${id} logSource`;
  }

  remove(id: number) {
    return `This action removes a #${id} logSource`;
  }
}
