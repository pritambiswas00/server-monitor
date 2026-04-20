import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mock } from 'vitest-mock-extended';
import { isoUserId, User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Mocked<UsersService>
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: mock<UsersService>(),
      }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<Mocked<UsersService>>(UsersService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const users: User[] = [
      { id: isoUserId.wrap("some-uuid1"), name: 'John Doe', email: 'john.doe@example.com' },
      { id: isoUserId.wrap("some-uuid2"), name: 'Jane Doe', email: 'some@mail.com' }];
    service.findAll.mockResolvedValue(users);
    const allUsers = await controller.findAll();

    expect(allUsers).toBeInstanceOf(Array);
    expect(service.findAll).toHaveBeenCalledOnce();
    expect(allUsers).toHaveLength(2)
  });

  it('should return a user by id', async () => {
    const user: User = { id: isoUserId.wrap("some-uuid"), name: 'John Doe', email: 'john.doe@example.com' };
    service.findOne.mockResolvedValue(user);
    const foundUser = await controller.findOne(isoUserId.wrap("some-uuid"));

    expect(foundUser).toEqual(user);
    expect(service.findOne).toHaveBeenCalledWith("some-uuid");
  });

  it('should create a new user', async () => {
    const user: User = { id: isoUserId.wrap("some-uuid"), name: 'John Doe', email: 'john.doe@example.com' };
    service.create.mockResolvedValue(user);
    const createdUser = await controller.create({ name: 'John Doe', email: 'john.doe@example.com' });

    expect(createdUser).toEqual(user);
    expect(service.create).toHaveBeenCalledWith({ name: 'John Doe', email: 'john.doe@example.com' });
  })

  it('should delete a user by id', async () => {
    service.remove.mockResolvedValue({ id: isoUserId.wrap("some-uuid"), name: 'John Doe', email: 'john.doe@example.com' });
    await controller.remove(isoUserId.wrap("some-uuid"));
    expect(service.remove).toHaveBeenCalledWith("some-uuid");
  });
});