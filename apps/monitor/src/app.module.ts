import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteServerModule } from './remote-server/remote-server.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'monitor.db',
      synchronize: true,
      autoLoadEntities: true,
  }), UsersModule, RemoteServerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
