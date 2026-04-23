import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServerService } from './remote-server.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RemoteServer } from './entities/remote-server.entity';

describe('RemoteServerService', () => {
  let service: RemoteServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RemoteServerService,
          useValue: mock<RemoteServerService>()
        },
      ],
    }).compile();

    service = module.get<RemoteServerService>(RemoteServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
