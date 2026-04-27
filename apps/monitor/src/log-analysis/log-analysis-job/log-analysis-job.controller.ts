import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogAnalysisJobService } from './log-analysis-job.service';
import { CreateLogAnalysisJobDto } from './dto/create-log-analysis-job.dto';
import { UpdateLogAnalysisJobDto } from './dto/update-log-analysis-job.dto';

@Controller('log-analysis-job')
export class LogAnalysisJobController {
  constructor(private readonly logAnalysisJobService: LogAnalysisJobService) {}

  @Post()
  create(@Body() createLogAnalysisJobDto: CreateLogAnalysisJobDto) {
    return this.logAnalysisJobService.create(createLogAnalysisJobDto);
  }

  @Get()
  findAll() {
    return this.logAnalysisJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logAnalysisJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogAnalysisJobDto: UpdateLogAnalysisJobDto) {
    return this.logAnalysisJobService.update(+id, updateLogAnalysisJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logAnalysisJobService.remove(+id);
  }
}
