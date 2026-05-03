import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isoUserId, User, type UserId } from './entities/user.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  create(createUserDto: CreateUserDto) {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.findOneBy({ email: createUserDto.email }),
        () => new InternalServerErrorException(`Create User :: Error Occurred while creating user`)
      ),
      TE.flatMap((isUserExist) => pipe(
        O.fromNullable(isUserExist),
        O.match(
          () => TE.right(this.userRepo.create(createUserDto)),
          (user) => TE.left(new ConflictException(`CreateUser :: User with Email ${user.email} already exists`))
        )
      )),
      TE.flatMap((user) => TE.tryCatch(
        () => this.userRepo.save(user),
        () => new InternalServerErrorException("Create User :: Error Occurred while saving user")
      ))
    )
  }

  findAll() {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.find(),
        () => new InternalServerErrorException("FindAll :: Error Occurred while find all users")
      )
    )
  }

  findOne(id: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.findOneBy({ id }),
        () => new InternalServerErrorException(`FindOne :: Error Occurred while finding User By Id ${isoUserId.unwrap(id)}`)
      ),
      TE.flatMap((isFoundUser) => TE.right(O.fromNullable(isFoundUser)))
    )
  }

  update(id: UserId, updateUserDto: UpdateUserDto) {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.preload({ id }),
        () => new InternalServerErrorException(`User Update :: Error Occurred while preloading user with id ${isoUserId.unwrap(id)}`)
      ),
      TE.flatMap((isUserExist) => pipe(
        O.fromNullable(isUserExist),
        O.match(
          () => TE.left(new NotFoundException(`User Update :: User with id ${isoUserId.unwrap(id)} not found`)),
          (user) => TE.right(user)
        )
      )),
      TE.flatMap((user) => TE.tryCatch(
        () => this.userRepo.save(Object.assign(user, updateUserDto)),
        () => new InternalServerErrorException(`User Update :: Error Occurred while saving user with id ${isoUserId.unwrap(id)}`)
      ))
    )
  }

  remove(id: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.findOneBy({ id }),
        () => new InternalServerErrorException(`User Remove :: Error Occurred while finding user with id ${isoUserId.unwrap(id)}`)
      ),
      TE.flatMap((isUserFound) => pipe(
        O.fromNullable(isUserFound),
        O.match(
          () => TE.left(new NotFoundException(`User Remove :: User with ID ${isoUserId.unwrap(id)} not found`)),
          (user) => TE.right(user)
        )
      )),
      TE.flatMap((user) => TE.tryCatch(
        () => this.userRepo.remove(user),
        () => new InternalServerErrorException(`User Remove :: Error Occurred while deleting user with Id ${isoUserId.unwrap(id)}`)
      ))
    )
  }

  findByEmail(email: string) {
    return pipe(
      TE.tryCatch(
        () => this.userRepo.findOneBy({ email }),
        () => new InternalServerErrorException(`FindByEmail :: Error Occurred while finding user with email ${email}`)
      ),
      TE.map(O.fromNullable)
    );
  }
}
