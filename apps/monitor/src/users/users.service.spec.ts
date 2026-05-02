import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isoUserId, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { mockDeep } from 'vitest-mock-extended';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: ReturnType<typeof mockDeep<Repository<User>>>;

  const userId = isoUserId.wrap('00000000-0000-0000-0000-000000000001');
  const mockUser: User = { id: userId, name: 'Alice', email: 'alice@test.com' };

  beforeEach(async () => {
    repo = mockDeep<Repository<User>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'Alice', email: 'alice@test.com' };

    it('returns Right with saved user when email is not taken', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const result = await service.create(dto)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(result.right).toEqual(mockUser);
    });

    it('returns Left ConflictException when email already exists', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const result = await service.create(dto)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns Right with array of users', async () => {
      repo.find.mockResolvedValue([mockUser]);

      const result = await service.findAll()();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(result.right).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('returns Right Some when user is found', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isSome(result.right)).toBe(true);
    });

    it('returns Right None when user is not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(userId)();

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) expect(O.isNone(result.right)).toBe(true);
    });
  });

  describe('update', () => {
    const dto = { name: O.some('Bob'), email: O.none };

    it('returns Right with updated user', async () => {
      const updated = { ...mockUser, name: 'Bob' };
      repo.preload.mockResolvedValue(mockUser);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(userId, dto)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when user does not exist', async () => {
      repo.preload.mockResolvedValue(undefined);

      const result = await service.update(userId, dto)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('returns Right when user is removed', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);
      repo.remove.mockResolvedValue(mockUser);

      const result = await service.remove(userId)();

      expect(E.isRight(result)).toBe(true);
    });

    it('returns Left NotFoundException when user is not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.remove(userId)();

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) expect(result.left).toBeInstanceOf(NotFoundException);
    });
  });
});
