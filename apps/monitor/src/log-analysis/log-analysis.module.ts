import { Module } from '@nestjs/common';
import { LogAnalysisController } from './log-analysis.controller';

@Module({
  controllers: [LogAnalysisController],
})
export class LogAnalysisModule {}
