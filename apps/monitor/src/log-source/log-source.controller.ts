import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogSourceService } from './log-source.service';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';

@Controller('log-source')
export class LogSourceController {
  constructor(private readonly logSourceService: LogSourceService) {}

  @Post()
  create(@Body() createLogSourceDto: CreateLogSourceDto) {
    return this.logSourceService.create(createLogSourceDto);
  }

  @Get()
  findAll() {
    return this.logSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logSourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogSourceDto: UpdateLogSourceDto) {
    return this.logSourceService.update(+id, updateLogSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logSourceService.remove(+id);
  }
}
