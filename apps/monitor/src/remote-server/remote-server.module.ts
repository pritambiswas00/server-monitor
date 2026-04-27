import { Module } from '@nestjs/common';
import { RemoteServerService } from './remote-server.service';
import { RemoteServerController } from './remote-server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteServer } from './entities/remote-server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemoteServer])],
  controllers: [RemoteServerController],
  providers: [RemoteServerService],
  exports: [RemoteServerService]
})
export class RemoteServerModule {}
