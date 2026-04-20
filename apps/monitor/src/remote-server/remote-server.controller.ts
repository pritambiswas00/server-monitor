import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemoteServerService } from './remote-server.service';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { isoUserId, User } from '../users/entities/user.entity';
import { isoOwnerId, remoteServerIdPipeTransformer, type RemoteServerId } from './entities/remote-server.entity';


@Controller('remote-server')
export class RemoteServerController {
  constructor(private readonly remoteServerService: RemoteServerService) { }

  @Post()
  create(@Body() createRemoteServerDto: CreateRemoteServerDto, @CurrentUser() user: User) {
    return this.remoteServerService.create(createRemoteServerDto, isoOwnerId.wrap(isoUserId.unwrap(user.id)));
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.remoteServerService.findAll(isoOwnerId.wrap(isoUserId.unwrap(user.id)));
  }

  @Get(':id')
  findOne(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId) {
    return this.remoteServerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId, @Body() updateRemoteServerDto: UpdateRemoteServerDto) {
    return this.remoteServerService.update(id, updateRemoteServerDto);
  }

  @Delete(':id')
  remove(@Param('id', remoteServerIdPipeTransformer) id: RemoteServerId) {
    return this.remoteServerService.remove(id);
  }
}
