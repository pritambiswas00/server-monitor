import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServerService } from './remote-server.service';

describe('RemoteServerService', () => {
  let service: RemoteServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoteServerService],
    }).compile();

    service = module.get<RemoteServerService>(RemoteServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
