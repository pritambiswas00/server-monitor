import { Test, TestingModule } from '@nestjs/testing';
import { LogAnalysisJobService } from './log-analysis-job.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isLogAnalysisJobId, LogAnalysisJob, LogAnalysisJobStatus, LogAnalysisJobType } from './entities/log-analysis-job.entity';
import { isoUserId } from '@/users/entities/user.entity';
import { isLogSourceId, LogSource, LogSourceType, LogStatus } from '@/log-source/entities/log-source.entity';
import { isoRemoteServerId, RemoteServer, RemoteServerStatus } from '@/remote-server/entities/remote-server.entity';
import { LogSourceService } from '@/log-source/log-source.service';
import { RemoteServerService } from '@/remote-server/remote-server.service';
import { Repository } from 'typeorm';
import { mockDeep } from 'vitest-mock-extended';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { NotFoundException } from '@nestjs/common';

describe('LogAnalysisJobService', () => {
  let service: LogAnalysisJobService;
  let repo: ReturnType<typeof mockDeep<Repository<LogAnalysisJob>>>;
  let logSourceService: ReturnType<typeof mockDeep<LogSourceService>>;
  let remoteServerService: ReturnType<typeof mockDeep<RemoteServerService>>;

  const userId = isoUserId.wrap('00000000-0000-0000-0000-000000000001');
  const logSourceId = isLogSourceId.wrap('00000000-0000-0000-0000-000000000003');
  const remoteServerId = isoRemoteServerId.wrap('00000000-0000-0000-0000-000000000002');
  const jobId = isLogAnalysisJobId.wrap('00000000-0000-0000-0000-000000000004');

  const mockLogSource = { id: logSourceId, ownerId: userId, name: 'prom', description: O.none, config: {}, type: LogSourceType.PROMETHEUS, status: LogStatus.UNKNOWN, createdAt: new Date(), updatedAt: new Date() } as LogSource;
  const mockRemoteServer = { id: remoteServerId, ownerId: userId, name: 'srv', description: O.none, config: {}, status: RemoteServerStatus.UNKNOWN, createdAt: new Date(), updatedAt: new Date() } as RemoteServer;
  const mockJob: LogAnalysisJob = {
    id: jobId,
    ownerId: userId,
    name: 'job-1',
    description: O.none,
    status: LogAnalysisJobStatus.INITIALIZED,
    logSource: mockLogSource,
    remoteServer: mockRemoteServer,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as LogAnalysisJob;

  beforeEach(async () => {
    repo = mockDeep<Repository<LogAnalysisJob>>();
    logSourceService = mockDeep<LogSourceService>();
    remoteServerService = mockDeep<RemoteServerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogAnalysisJobService,
        { provide: getRepositoryToken(LogAnalysisJob), useValue: repo },
        { provide: LogSourceService, useValue: logSourceService },
        { provide: RemoteServerService, useValue: remoteServerService },
      ],
    }).compile();
    service = module.get<LogAnalysisJobService>(LogAnalysisJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'job-1', description: O.none, type: LogAnalysisJobType.ONE_TIME, logSourceId, remoteServerId };

    it('returns Right with saved job when log source and remote server exist', async () => {
      logSourceService.findOne.mockReturnValue(TE.right(O.some(mockLogSource)));
      remoteServerService.findOne.mockReturnValue(TE.right(O.some(mockRemoteServer)));
      repo.create.mockReturnValue(mockJob);
      repo.save.mockResolvedValue(mockJob);

      const result = await service.create(dto, userId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when log source is not found', async () => {
      logSourceService.findOne.mockReturnValue(TE.right(O.none));

      const result = await service.create(dto, userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });

    it('returns Left NotFoundException when remote server is not found', async () => {
      logSourceService.findOne.mockReturnValue(TE.right(O.some(mockLogSource)));
      remoteServerService.findOne.mockReturnValue(TE.right(O.none));

      const result = await service.create(dto, userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns Right with array of jobs', async () => {
      repo.find.mockResolvedValue([mockJob]);

      const result = await service.findAll(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(result.right).toEqual([mockJob]);
    });
  });

  describe('findOne', () => {
    it('returns Right Some when job is found', async () => {
      repo.findOne.mockResolvedValue(mockJob);

      const result = await service.findOne(jobId, userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isSome(result.right)).toBe(true);
    });

    it('returns Right None when job is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findOne(jobId, userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isNone(result.right)).toBe(true);
    });
  });

  describe('update', () => {
    const dto = { name: O.some('updated-job'), description: O.none };

    it('returns Right with updated job', async () => {
      repo.preload.mockResolvedValue(mockJob);
      repo.save.mockResolvedValue({ ...mockJob, name: 'updated-job' });

      const result = await service.update(jobId, dto)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when job does not exist', async () => {
      repo.preload.mockResolvedValue(undefined);

      const result = await service.update(jobId, dto)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('returns Right when job is removed', async () => {
      repo.findOne.mockResolvedValue(mockJob);
      repo.remove.mockResolvedValue(mockJob);

      const result = await service.remove(jobId, userId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when job is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.remove(jobId, userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });
});
