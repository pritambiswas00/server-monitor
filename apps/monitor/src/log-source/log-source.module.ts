import { Module } from '@nestjs/common';
import { LogSourceService } from './log-source.service';
import { LogSourceController } from './log-source.controller';

@Module({
  controllers: [LogSourceController],
  providers: [LogSourceService],
})
export class LogSourceModule {}
