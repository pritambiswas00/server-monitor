import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogSourceService } from './log-source.service';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';
import { CurrentUser } from '@/auth/current-user.decorator';
import { type User } from '@/users/entities/user.entity';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { type LogSourceId, logSourceIdPipeTransformer } from './entities/log-source.entity';

@Controller('log-source')
export class LogSourceController {
  constructor(private readonly logSourceService: LogSourceService) { }

  @Post()
  async create(@Body() createLogSourceDto: CreateLogSourceDto, @CurrentUser() owner: User) {
    const result = await this.logSourceService.create(createLogSourceDto, owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    );
  }

  @Get()
  async findAll(@CurrentUser() owner: User) {
    const result = await this.logSourceService.findAll(owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    );
  }

  @Get(':id')
  async findOne(@Param('id', logSourceIdPipeTransformer) id: LogSourceId, @CurrentUser() owner: User) {
    const result = await this.logSourceService.findOne(id)();
    return pipe(
      result,
      E.map((optionalLogSource) => O.toNullable(optionalLogSource)),
      E.getOrElseW((error) => { throw error })
    )
  }

  @Patch(':id')
  async update(@Param('id', logSourceIdPipeTransformer) id: LogSourceId, @Body() updateLogSourceDto: UpdateLogSourceDto) {
    const result = await this.logSourceService.update(id, updateLogSourceDto)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }

  @Delete(':id')
  async remove(@Param('id', logSourceIdPipeTransformer) id: LogSourceId) {
    const result = await this.logSourceService.remove(id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }
}
