import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { isoRemoteServerId, RemoteServer, RemoteServerId, RemoteServerStatus } from './entities/remote-server.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as TE from 'fp-ts/TaskEither';
import { Repository } from 'typeorm';
import { isoUserId, UserId } from '@/users/entities/user.entity';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

@Injectable()
export class RemoteServerService {

  constructor(@InjectRepository(RemoteServer) private readonly remoteServerRepo: Repository<RemoteServer>) { }
  create(createRemoteServerDto: CreateRemoteServerDto, userId: UserId) {
    return pipe(
      this.findByNameAndUserId(userId, createRemoteServerDto.name),
      TE.flatMap((isRemoteServer) => pipe(
        isRemoteServer,
        O.match(
          () => TE.right(this.remoteServerRepo.create({
            ...createRemoteServerDto,
            status: RemoteServerStatus.UNKNOWN,
            ownerId: userId
          })),
          (remoteServer) => TE.left(new ConflictException(`Remote Server :: Remote Server with name ${remoteServer.name} with User ${isoUserId.unwrap(userId)} already exists`))
        )
      )),
      TE.flatMap((remoteServer) => TE.tryCatch(
        () => this.remoteServerRepo.save(remoteServer),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while saving the User ${isoUserId.unwrap(userId)}`)
      ))
    )
  }

  findByNameAndUserId(ownerId: UserId, name: string) {
    return pipe(
      TE.tryCatch(
        () => this.remoteServerRepo.findOneBy({ ownerId, name }),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while finding remote server with name ${name} for user with id ${isoUserId.unwrap(ownerId)}`)
      ),
      TE.flatMap((isRemoteServer) => TE.right(O.fromNullable(isRemoteServer)))
    )
  }

  findAll(ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.remoteServerRepo.find({ where: { ownerId } }),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while finding Remote Server for User ${isoUserId.unwrap(ownerId)}`)
      )
    )
  }

  findOne(id: RemoteServerId) {
    return pipe(
      TE.tryCatch(
        () => this.remoteServerRepo.findOne({ where: { id } }),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while finding Remote Server`)
      ),
      TE.flatMap((isRemoteServerExist) => TE.right(O.fromNullable(isRemoteServerExist)))
    )
  }

  update(id: RemoteServerId, updateRemoteServerDto: UpdateRemoteServerDto) {
    return pipe(
      TE.tryCatch(
        () => this.remoteServerRepo.preload({ id }),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while Finding Remote Server ${isoRemoteServerId.unwrap(id)}`)
      ),
      TE.flatMap((isRemoteServerExist) => pipe(
        O.fromNullable(isRemoteServerExist),
        O.match(
          () => TE.left(new NotFoundException(`Remote Server :: Remote Server Id ${isoRemoteServerId.unwrap(id)} not found`)),
          (remoteServer) => TE.right(remoteServer)
        )
      )),
      TE.flatMap((remoteServer) => TE.tryCatch(
        () => this.remoteServerRepo.save(Object.assign(remoteServer, updateRemoteServerDto)),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while updating the Remote Server with Id ${isoRemoteServerId.unwrap(id)}`)
      ))

    )
  }

  remove(id: RemoteServerId) {
    return pipe(
      TE.tryCatch(
        () => this.remoteServerRepo.findOne({ where: { id } }),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while finding Remote Server Id ${isoRemoteServerId.unwrap(id)}`)
      ),
      TE.flatMap((isRemoteServerExist) => pipe(
        O.fromNullable(isRemoteServerExist),
        O.match(
          () => TE.left(new NotFoundException(`Remote Server :: Remote Server Id ${isoRemoteServerId.unwrap(id)} not found`)),
          (remoteServer) => TE.right(remoteServer)
        )
      )),
      TE.flatMap((remoteServer) => TE.tryCatch(
        () => this.remoteServerRepo.remove(remoteServer),
        () => new InternalServerErrorException(`Remote Server :: Error Occurred while deleting Remote Server Id ${isoRemoteServerId.unwrap(id)}`)
      ))
    )
  }
}
