import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockDeep } from 'vitest-mock-extended';
import { isoUserId, User } from './entities/user.entity';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: ReturnType<typeof mockDeep<UsersService>>;

  const userId = isoUserId.wrap('some-uuid');
  const mockUser: User = { id: userId, name: 'John Doe', email: 'john.doe@example.com' };

  beforeEach(async () => {
    service = mockDeep<UsersService>();
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const users: User[] = [
      { id: isoUserId.wrap('some-uuid1'), name: 'John Doe', email: 'john.doe@example.com' },
      { id: isoUserId.wrap('some-uuid2'), name: 'Jane Doe', email: 'some@mail.com' },
    ];
    service.findAll.mockReturnValue(TE.right(users));

    const result = await controller.findAll();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(service.findAll).toHaveBeenCalledOnce();
  });

  it('should return a user by id', async () => {
    service.findOne.mockReturnValue(TE.right(O.some(mockUser)));

    const result = await controller.findOne(userId);

    expect(O.isSome(result as O.Option<User>)).toBe(true);
    expect(service.findOne).toHaveBeenCalledWith(userId);
  });

  it('should create a new user', async () => {
    service.create.mockReturnValue(TE.right(mockUser));
    const dto = { name: 'John Doe', email: 'john.doe@example.com' };

    const result = await controller.create(dto);

    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException when email already exists', async () => {
    service.create.mockReturnValue(TE.left(new ConflictException('already exists')));

    await expect(controller.create({ name: 'John Doe', email: 'john.doe@example.com' }))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('should delete a user by id', async () => {
    service.remove.mockReturnValue(TE.right(mockUser));

    await controller.remove(userId);

    expect(service.remove).toHaveBeenCalledWith(userId);
  });
});