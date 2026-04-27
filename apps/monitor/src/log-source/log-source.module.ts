import { Module } from '@nestjs/common';
import { LogSourceService } from './log-source.service';
import { LogSourceController } from './log-source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogSource } from './entities/log-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogSource])],
  controllers: [LogSourceController],
  providers: [LogSourceService],
  exports: [LogSourceService]
})
export class LogSourceModule {}
