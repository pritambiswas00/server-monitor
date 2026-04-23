import { Test, TestingModule } from '@nestjs/testing';
import { LogSourceService } from './log-source.service';

describe('LogSourceService', () => {
  let service: LogSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogSourceService],
    }).compile();

    service = module.get<LogSourceService>(LogSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
