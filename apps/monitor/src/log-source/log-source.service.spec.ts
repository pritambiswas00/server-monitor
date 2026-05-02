import { Test, TestingModule } from '@nestjs/testing';
import { LogSourceService } from './log-source.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isLogSourceId, LogSource, LogSourceType, LogStatus } from './entities/log-source.entity';
import { isoUserId } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { mockDeep } from 'vitest-mock-extended';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('LogSourceService', () => {
  let service: LogSourceService;
  let repo: ReturnType<typeof mockDeep<Repository<LogSource>>>;

  const userId = isoUserId.wrap('00000000-0000-0000-0000-000000000001');
  const logSourceId = isLogSourceId.wrap('00000000-0000-0000-0000-000000000003');
  const mockLogSource: LogSource = {
    id: logSourceId,
    ownerId: userId,
    name: 'prometheus-1',
    description: O.none,
    config: {},
    type: LogSourceType.PROMETHEUS,
    status: LogStatus.UNKNOWN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = mockDeep<Repository<LogSource>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogSourceService,
        { provide: getRepositoryToken(LogSource), useValue: repo },
      ],
    }).compile();
    service = module.get<LogSourceService>(LogSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'prometheus-1', description: O.none, config: {}, type: LogSourceType.PROMETHEUS };

    it('returns Right with saved log source when no conflict', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(mockLogSource);
      repo.save.mockResolvedValue(mockLogSource);

      const result = await service.create(dto, userId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left ConflictException when log source with same name exists', async () => {
      repo.findOneBy.mockResolvedValue(mockLogSource);

      const result = await service.create(dto, userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns Right with array of log sources', async () => {
      repo.find.mockResolvedValue([mockLogSource]);

      const result = await service.findAll(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(result.right).toEqual([mockLogSource]);
    });
  });

  describe('findOne', () => {
    it('returns Right Some when log source is found', async () => {
      repo.findOne.mockResolvedValue(mockLogSource);

      const result = await service.findOne(logSourceId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isSome(result.right)).toBe(true);
    });

    it('returns Right None when log source is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findOne(logSourceId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isNone(result.right)).toBe(true);
    });
  });

  describe('update', () => {
    const dto = { name: O.some('updated-name'), description: O.none };

    it('returns Right with updated log source', async () => {
      repo.preload.mockResolvedValue(mockLogSource);
      repo.save.mockResolvedValue({ ...mockLogSource, name: 'updated-name' });

      const result = await service.update(logSourceId, dto)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when log source does not exist', async () => {
      repo.preload.mockResolvedValue(undefined);

      const result = await service.update(logSourceId, dto)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('returns Right when log source is removed', async () => {
      repo.findOne.mockResolvedValue(mockLogSource);
      repo.remove.mockResolvedValue(mockLogSource);

      const result = await service.remove(logSourceId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when log source is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.remove(logSourceId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });
});
