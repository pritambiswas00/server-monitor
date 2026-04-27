import { Module } from '@nestjs/common';
import { LogAnalysisJobService } from './log-analysis-job.service';
import { LogAnalysisJobController } from './log-analysis-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAnalysisJob } from './entities/log-analysis-job.entity';
import { RemoteServerModule } from '@/remote-server/remote-server.module';
import { LogSourceModule } from '@/log-source/log-source.module';

@Module({
  imports: [TypeOrmModule.forFeature([LogAnalysisJob]), LogSourceModule, RemoteServerModule],
  controllers: [LogAnalysisJobController],
  providers: [LogAnalysisJobService],
})
export class LogAnalysisJobModule {}
