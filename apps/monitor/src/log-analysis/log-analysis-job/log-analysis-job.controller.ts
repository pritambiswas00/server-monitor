import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogAnalysisJobService } from './log-analysis-job.service';
import { CreateLogAnalysisJobDto } from './dto/create-log-analysis-job.dto';
import { UpdateLogAnalysisJobDto } from './dto/update-log-analysis-job.dto';
import { CurrentUser } from '@/auth/current-user.decorator';
import { User, type UserId } from '@/users/entities/user.entity';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { type LogAnalysisJobId, logAnalysisJobIdPipeTransformer } from './entities/log-analysis-job.entity';

@Controller('log-analysis-job')
export class LogAnalysisJobController {
  constructor(private readonly logAnalysisJobService: LogAnalysisJobService) { }

  @Post()
  async create(@Body() createLogAnalysisJobDto: CreateLogAnalysisJobDto, @CurrentUser() owner: User) {
    const result = await this.logAnalysisJobService.create(createLogAnalysisJobDto, owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }

  @Get()
  async findAll(@CurrentUser() owner: User) {
    const result = await this.logAnalysisJobService.findAll(owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }

  @Get(':id')
  async findOne(@Param('id', logAnalysisJobIdPipeTransformer) id: LogAnalysisJobId, @CurrentUser() owner: User) {
    const result = await this.logAnalysisJobService.findOne(id, owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }

  @Patch(':id')
  async update(@Param('id', logAnalysisJobIdPipeTransformer) id: LogAnalysisJobId, @Body() updateLogAnalysisJobDto: UpdateLogAnalysisJobDto) {
    const result = await this.logAnalysisJobService.update(id, updateLogAnalysisJobDto)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }

  @Delete(':id')
  async remove(@Param('id', logAnalysisJobIdPipeTransformer) id: LogAnalysisJobId, @CurrentUser() owner: User) {
    const result = await this.logAnalysisJobService.remove(id, owner.id)();
    return pipe(
      result,
      E.getOrElseW((error) => { throw error })
    )
  }
}
