import { Test, TestingModule } from '@nestjs/testing';
import { LogAnalysisJobController } from './log-analysis-job.controller';
import { LogAnalysisJobService } from './log-analysis-job.service';
import { mockDeep } from 'vitest-mock-extended';

describe('LogAnalysisJobController', () => {
  let controller: LogAnalysisJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogAnalysisJobController],
      providers: [{ provide: LogAnalysisJobService, useValue: mockDeep<LogAnalysisJobService>() }],
    }).compile();

    controller = module.get<LogAnalysisJobController>(LogAnalysisJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
