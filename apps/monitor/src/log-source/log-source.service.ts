import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isLogSourceId, LogSource, LogSourceId, LogStatus } from './entities/log-source.entity';
import { Repository } from 'typeorm';
import * as O from 'fp-ts/Option';
import { isoUserId, type UserId } from '@/users/entities/user.entity';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

@Injectable()
export class LogSourceService {


  constructor(@InjectRepository(LogSource) private logRepo: Repository<LogSource>) { }

  create(createLogSourceDto: CreateLogSourceDto, ownerId: UserId) {
    return pipe(
      this.findByNameAndUserId(createLogSourceDto.name, ownerId),
      TE.flatMap((isLogSource) => pipe(
        isLogSource,
        O.match(
          () => TE.right(this.logRepo.create({
            ...createLogSourceDto,
            ownerId,
            status: LogStatus.UNKNOWN
          })),
          (logSource) => TE.left(new ConflictException(`Log Source :: User ${isoUserId.unwrap(ownerId)} with name ${logSource.name} already exists.`)))
      )),
      TE.flatMap((logSource) => TE.tryCatch(
        () => this.logRepo.save(logSource),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while saving the log source ${isLogSourceId.unwrap(logSource.id)}`)
      ))
    )
  }

  findByNameAndUserId(name: string, ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.logRepo.findOneBy({ name, ownerId }),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while finding remote server with name ${name} for user with id ${isoUserId.unwrap(ownerId)}`)
      ),
      TE.flatMap((isLogSource) => TE.right(O.fromNullable(isLogSource)))
    )
  }

  findAll(ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.logRepo.find({ where: { ownerId } }),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while finding Log Source for User ${isoUserId.unwrap(ownerId)}`)
      )
    )
  }

  findOne(id: LogSourceId) {
    return pipe(
      TE.tryCatch(
        () => this.logRepo.findOne({ where: { id } }),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while finding Log Source`)
      ),
      TE.flatMap((isLogSourceExist) => TE.right(O.fromNullable(isLogSourceExist)))
    )
  }

  update(id: LogSourceId, updateLogSourceDto: UpdateLogSourceDto) {
    return pipe(
      TE.tryCatch(
        () => this.logRepo.preload({ id }),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while Finding Log Source ${isLogSourceId.unwrap(id)}`)
      ),
      TE.flatMap((isLogSourceExist) => pipe(
        O.fromNullable(isLogSourceExist),
        O.match(
          () => TE.left(new NotFoundException(`Log Source :: Log Source Id ${isLogSourceId.unwrap(id)} not found`)),
          (logSource) => TE.right(logSource)
        )
      )),
      TE.flatMap((logSource) => TE.tryCatch(
        () => this.logRepo.save(Object.assign(logSource, updateLogSourceDto)),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while updating the Log Source with Id ${isLogSourceId.unwrap(id)}`)
      ))

    )
  }

  remove(id: LogSourceId) {
    return pipe(
      TE.tryCatch(
        () => this.logRepo.findOne({ where: { id } }),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while finding Log Source Id ${isLogSourceId.unwrap(id)}`)
      ),
      TE.flatMap((isLogSourceExist) => pipe(
        O.fromNullable(isLogSourceExist),
        O.match(
          () => TE.left(new NotFoundException(`Log Source :: Log Source Id ${isLogSourceId.unwrap(id)} not found`)),
          (logSource) => TE.right(logSource)
        )
      )),
      TE.flatMap((logSource) => TE.tryCatch(
        () => this.logRepo.remove(logSource),
        () => new InternalServerErrorException(`Log Source :: Error Occurred while deleting Log Source Id ${isLogSourceId.unwrap(id)}`)
      ))
    )
  }
}
