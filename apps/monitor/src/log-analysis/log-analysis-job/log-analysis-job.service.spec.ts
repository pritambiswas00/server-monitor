import { Test, TestingModule } from '@nestjs/testing';
import { LogAnalysisJobService } from './log-analysis-job.service';

describe('LogAnalysisJobService', () => {
  let service: LogAnalysisJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogAnalysisJobService],
    }).compile();

    service = module.get<LogAnalysisJobService>(LogAnalysisJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
