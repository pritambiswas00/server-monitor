import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemoteServerService } from './remote-server.service';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { isoUserId, User } from '../users/entities/user.entity';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { remoteServerIdPipeTransformer, type RemoteServerId } from './entities/remote-server.entity';


@Controller('remote-server')
export class RemoteServerController {
  constructor(private readonly remoteServerService: RemoteServerService) { }

  @Post()
  async create(@Body() createRemoteServerDto: CreateRemoteServerDto, @CurrentUser() user: User) {
    const result = await this.remoteServerService.create(createRemoteServerDto, user.id)();
    return pipe(
        result,
        E.getOrElseW((error) => { throw error })
    )
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const result = await this.remoteServerService.findAll(user.id)();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }

  @Get(':id')
  async findOne(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId) {
    const result = await this.remoteServerService.findOne(id)();
    return pipe(
       result,
       E.map((optionalRemoteServer) => O.toNullable(optionalRemoteServer)),
       E.getOrElseW((error) => { throw error })
    )
  }

  @Patch(':id')
  async update(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId, @Body() updateRemoteServerDto: UpdateRemoteServerDto) {
    const result = await this.remoteServerService.update(id, updateRemoteServerDto)();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }

  @Delete(':id')
  async remove(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId) {
    const result = await this.remoteServerService.remove(id)();
    return pipe(
       result,
       E.getOrElseW((error) => { throw error })
    )
  }
}
