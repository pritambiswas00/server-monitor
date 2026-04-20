import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isoUserId, User, type UserId } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: UserId) {
    return this.userRepo.findOneBy({ id });
  }

  async update(id: UserId, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${isoUserId.unwrap(id)} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async remove(id: UserId) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${isoUserId.unwrap(id)} not found`);
    }
    return this.userRepo.remove(user);
  }
}
