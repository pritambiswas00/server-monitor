import { Test, TestingModule } from '@nestjs/testing';
import { LogSourceController } from './log-source.controller';
import { LogSourceService } from './log-source.service';

describe('LogSourceController', () => {
  let controller: LogSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogSourceController],
      providers: [LogSourceService],
    }).compile();

    controller = module.get<LogSourceController>(LogSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
