import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isoUserId, userIdPipeTransformer, type UserId } from './entities/user.entity';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
      const result = await this.usersService.create(createUserDto)();
      return pipe(
         result,
         E.getOrElseW((error) => { throw error })
      )
  }

  @Get()
  async findAll() {
    const result = await this.usersService.findAll()();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }

  @Get(':id')
  async findOne(@Param('id', userIdPipeTransformer) id: UserId) {
    const result = await this.usersService.findOne(id)();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }

  @Patch(':id')
  async update(@Param('id', userIdPipeTransformer) id: UserId, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto)();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }

  @Delete(':id')
  async remove(@Param('id', userIdPipeTransformer) id: UserId) {
     const result = await this.usersService.remove(id)();
     return pipe(
       result,
       E.getOrElseW((error) => { throw error })
     ) 
  }
}
