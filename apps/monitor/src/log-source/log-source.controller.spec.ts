import { Test, TestingModule } from '@nestjs/testing';
import { LogSourceController } from './log-source.controller';
import { LogSourceService } from './log-source.service';
import { mockDeep } from 'vitest-mock-extended';

describe('LogSourceController', () => {
  let controller: LogSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogSourceController],
      providers: [{ provide: LogSourceService, useValue: mockDeep<LogSourceService>() }],
    }).compile();

    controller = module.get<LogSourceController>(LogSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
