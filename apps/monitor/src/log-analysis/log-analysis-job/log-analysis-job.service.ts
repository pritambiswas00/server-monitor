import { Injectable } from '@nestjs/common';
import { CreateLogAnalysisJobDto } from './dto/create-log-analysis-job.dto';
import { UpdateLogAnalysisJobDto } from './dto/update-log-analysis-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogAnalysisJob } from './entities/log-analysis-job.entity';
import { Repository } from 'typeorm';
import { LogSourceService } from '@/log-source/log-source.service';
import { RemoteServerService } from '@/remote-server/remote-server.service';

@Injectable()
export class LogAnalysisJobService {
  constructor(@InjectRepository(LogAnalysisJob) private readonly logAnalysisJobRepo: Repository<LogAnalysisJob>, private readonly logSourceService: LogSourceService, private readonly remoteServerService: RemoteServerService) {}
  create(createLogAnalysisJobDto: CreateLogAnalysisJobDto) {
    return 'This action adds a new logAnalysisJob';
  }

  findAll() {
    return `This action returns all logAnalysisJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logAnalysisJob`;
  }

  update(id: number, updateLogAnalysisJobDto: UpdateLogAnalysisJobDto) {
    return `This action updates a #${id} logAnalysisJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} logAnalysisJob`;
  }
}
