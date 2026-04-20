import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { type OwnerId, RemoteServer, RemoteServerId, RemoteServerStatus } from './entities/remote-server.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RemoteServerService {

  constructor(@InjectRepository(RemoteServer) private readonly remoteServerRepo: Repository<RemoteServer>) {}
  create(createRemoteServerDto: CreateRemoteServerDto, ownerId: OwnerId) {
      const remoteServer = this.remoteServerRepo.create({
          ...createRemoteServerDto,
          ownerId,
          status: RemoteServerStatus.UNKNOWN,
      });
      return this.remoteServerRepo.save(remoteServer);
  }

  findAll(ownerId: OwnerId) {
    return this.remoteServerRepo.find({ where: { ownerId } });
  }

  findOne(id: RemoteServerId) {
    return this.remoteServerRepo.findOne({ where: { id } });
  }

  async update(id: RemoteServerId, updateRemoteServerDto: UpdateRemoteServerDto) {
    const remoteServer = await this.remoteServerRepo.preload({ id, ...updateRemoteServerDto });
    if(!remoteServer) throw new NotFoundException("Remote server not found");
    return this.remoteServerRepo.save(remoteServer);
  }

  async remove(id: RemoteServerId) {
    const remoteServer = await this.remoteServerRepo.findOne({ where: { id } });
    if(!remoteServer) throw new NotFoundException("Remote server not found");
    return this.remoteServerRepo.remove(remoteServer);
  }
}
