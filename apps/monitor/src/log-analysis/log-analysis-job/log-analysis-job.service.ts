import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLogAnalysisJobDto } from './dto/create-log-analysis-job.dto';
import { UpdateLogAnalysisJobDto } from './dto/update-log-analysis-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isLogAnalysisJobId, LogAnalysisJob, LogAnalysisJobId, LogAnalysisJobStatus } from './entities/log-analysis-job.entity';
import { Repository } from 'typeorm';
import { LogSourceService } from '@/log-source/log-source.service';
import { RemoteServerService } from '@/remote-server/remote-server.service';
import { isoUserId, UserId } from '@/users/entities/user.entity';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';

@Injectable()
export class LogAnalysisJobService {
  constructor(@InjectRepository(LogAnalysisJob) private readonly logAnalysisJobRepo: Repository<LogAnalysisJob>, private readonly logSourceService: LogSourceService, private readonly remoteServerService: RemoteServerService) { }
  create(props: CreateLogAnalysisJobDto, userId: UserId) {
    return pipe(
      this.logSourceService.findOne(props.logSourceId),
      TE.flatMap((isLogSourceExist) => pipe(
        isLogSourceExist,
        O.match(
          () => TE.left(new NotFoundException(`Log Analysis Job :: Log Source with id ${props.logSourceId} not found`)),
          (logSource) => TE.right(logSource)
        )
      )),
      TE.flatMap((logSource) => pipe(
        this.remoteServerService.findOne(props.remoteServerId),
        TE.flatMap((isRemoteServerExist) => pipe(
          isRemoteServerExist,
          O.match(
            () => TE.left(new NotFoundException(`Log Analysis Job :: Remote Server with id ${props.remoteServerId} not found`)),
            (remoteServer) => TE.right(remoteServer)
          )
        )),
        TE.flatMap((remoteServer) => TE.right(this.logAnalysisJobRepo.create({
          ...props,
          logSource,
          remoteServer,
          ownerId: userId,
          status: LogAnalysisJobStatus.INITIALIZED
        }))),
        TE.flatMap((logAnalysisJob) => TE.tryCatch(
          () => this.logAnalysisJobRepo.save(logAnalysisJob),
          () => new InternalServerErrorException(`Log Analysis Job :: Error Occurred while saving log analysis job`)
        ))
      ))
    )

  }

  findAll(ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.logAnalysisJobRepo.find({ where: { ownerId } }),
        () => new InternalServerErrorException(`Log Analysis Job :: Error Occurred while finding log analysis jobs for user with id ${isoUserId.unwrap(ownerId)}`)
      )
    )
  }

  findOne(id: LogAnalysisJobId, ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.logAnalysisJobRepo.findOne({ where: { id, ownerId } }),
        () => new InternalServerErrorException(`Log Analysis Job :: Error Occurred while finding log analysis job with id ${isLogAnalysisJobId.unwrap(id)} for user with id ${isoUserId.unwrap(ownerId)}`)
      ),
      TE.flatMap((isLogAnalysisJobExist) => TE.right(O.fromNullable(isLogAnalysisJobExist)))
    )
  }

  update(id: LogAnalysisJobId, updateLogAnalysisJobDto: UpdateLogAnalysisJobDto) {
    return pipe(
      TE.tryCatch(
        () => this.logAnalysisJobRepo.preload({ id }),
        () => new InternalServerErrorException(`Log Analysis Job Update :: Error Occurred while preloading log analysis job with id ${isLogAnalysisJobId.unwrap(id)}`)
      ),
      TE.flatMap((isLogAnalysisJobExist) => pipe(
        O.fromNullable(isLogAnalysisJobExist),
        O.match(
          () => TE.left(new NotFoundException(`Log Analysis Job Update :: Log Analysis Job with id ${isLogAnalysisJobId.unwrap(id)} not found`)),
          (logAnalysisJob) => TE.right(logAnalysisJob)
        )
      )),
      TE.flatMap((logAnalysisJob) => TE.tryCatch(
        () => this.logAnalysisJobRepo.save(Object.assign(logAnalysisJob, updateLogAnalysisJobDto)),
        () => new InternalServerErrorException(`Log Analysis Job Update :: Error Occurred while saving log analysis job with id ${isLogAnalysisJobId.unwrap(id)}`)
      ))
    )
  }

  remove(id: LogAnalysisJobId, ownerId: UserId) {
    return pipe(
      TE.tryCatch(
        () => this.logAnalysisJobRepo.findOne({ where: { id, ownerId } }),
        () => new InternalServerErrorException(`Log Analysis Job Remove :: Error Occurred while finding log analysis job with id ${isLogAnalysisJobId.unwrap(id)} for user with id ${isoUserId.unwrap(ownerId)}`)
      ),
      TE.flatMap((isLogAnalysisJobExist) => pipe(
        O.fromNullable(isLogAnalysisJobExist),
        O.match(
          () => TE.left(new NotFoundException(`Log Analysis Job Remove :: Log Analysis Job with id ${isLogAnalysisJobId.unwrap(id)} for user with id ${isoUserId.unwrap(ownerId)} not found`)),
          (logAnalysisJob) => TE.right(logAnalysisJob)
        )
      )),
      TE.flatMap((logAnalysisJob) => TE.tryCatch(
        () => this.logAnalysisJobRepo.remove(logAnalysisJob),
        () => new InternalServerErrorException(`Log Analysis Job Remove :: Error Occurred while removing log analysis job with id ${isLogAnalysisJobId.unwrap(id)}`)
      ))
    )
  }
}
