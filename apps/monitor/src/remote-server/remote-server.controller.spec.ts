import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServerController } from './remote-server.controller';
import { RemoteServerService } from './remote-server.service';

describe('RemoteServerController', () => {
  let controller: RemoteServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteServerController],
      providers: [
        {
          provide: RemoteServerService,
          useValue: mock<RemoteServerService>()
        },
      ],
    }).compile();

    controller = module.get<RemoteServerController>(RemoteServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
