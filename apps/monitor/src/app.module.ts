import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteServerModule } from './remote-server/remote-server.module';
import { AuthModule } from './auth/auth.module';
import { LogSourceModule } from './log-source/log-source.module';
import { LogAnalysisJobModule } from './log-analysis/log-analysis-job/log-analysis-job.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'monitor.db',
      synchronize: true,
      autoLoadEntities: true,
  }), UsersModule, RemoteServerModule, AuthModule, LogSourceModule, LogAnalysisJobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
