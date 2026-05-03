import { Test, TestingModule } from '@nestjs/testing';
import { LogAnalysisService } from './log-analysis.service';

describe('LogAnalysisService', () => {
  let service: LogAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogAnalysisService],
    }).compile();

    service = module.get<LogAnalysisService>(LogAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
