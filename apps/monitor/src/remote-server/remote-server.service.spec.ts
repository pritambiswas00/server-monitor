import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServerService } from './remote-server.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isoRemoteServerId, RemoteServer, RemoteServerStatus } from './entities/remote-server.entity';
import { isoUserId } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { mockDeep } from 'vitest-mock-extended';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RemoteServerService', () => {
  let service: RemoteServerService;
  let repo: ReturnType<typeof mockDeep<Repository<RemoteServer>>>;

  const userId = isoUserId.wrap('00000000-0000-0000-0000-000000000001');
  const serverId = isoRemoteServerId.wrap('00000000-0000-0000-0000-000000000002');
  const mockServer: RemoteServer = {
    id: serverId,
    ownerId: userId,
    name: 'prod-server',
    description: O.none,
    config: {},
    status: RemoteServerStatus.UNKNOWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = mockDeep<Repository<RemoteServer>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoteServerService,
        { provide: getRepositoryToken(RemoteServer), useValue: repo },
      ],
    }).compile();
    service = module.get<RemoteServerService>(RemoteServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'prod-server', description: O.none, config: {} };

    it('returns Right with saved server when no conflict', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(mockServer);
      repo.save.mockResolvedValue(mockServer);

      const result = await service.create(dto, userId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left ConflictException when server with same name exists', async () => {
      repo.findOneBy.mockResolvedValue(mockServer);

      const result = await service.create(dto, userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns Right with array of servers', async () => {
      repo.find.mockResolvedValue([mockServer]);

      const result = await service.findAll(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(result.right).toEqual([mockServer]);
    });
  });

  describe('findOne', () => {
    it('returns Right Some when server is found', async () => {
      repo.findOne.mockResolvedValue(mockServer);

      const result = await service.findOne(serverId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isSome(result.right)).toBe(true);
    });

    it('returns Right None when server is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findOne(serverId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isNone(result.right)).toBe(true);
    });
  });

  describe('update', () => {
    const dto = { name: O.some('new-name'), description: O.none };

    it('returns Right with updated server', async () => {
      repo.preload.mockResolvedValue(mockServer);
      repo.save.mockResolvedValue({ ...mockServer, name: 'new-name' });

      const result = await service.update(serverId, dto)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when server does not exist', async () => {
      repo.preload.mockResolvedValue(undefined);

      const result = await service.update(serverId, dto)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('returns Right when server is removed', async () => {
      repo.findOne.mockResolvedValue(mockServer);
      repo.remove.mockResolvedValue(mockServer);

      const result = await service.remove(serverId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when server is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.remove(serverId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });
});
