import { Module } from '@nestjs/common';
import { LogSourceService } from './log-source.service';
import { LogSourceController } from './log-source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogSource } from './entities/log-source.entity';
import { FluentBitLogSourcePlugin } from './plugins/http/http-log-source.plugin';
import { PrometheusLogSourcePlugin } from './plugins/prometheus/prometheus-log-source.plugin';
import { LOG_SOURCE_PLUGIN_TOKEN, LogSourcePluginRegistry } from './plugins/log-source-plugin.registry';

@Module({
  imports: [TypeOrmModule.forFeature([LogSource])],
  controllers: [LogSourceController],
  providers: [
    FluentBitLogSourcePlugin,
    PrometheusLogSourcePlugin,
    {
      provide: LOG_SOURCE_PLUGIN_TOKEN,
      useFactory: (fluentBit: FluentBitLogSourcePlugin, prometheus: PrometheusLogSourcePlugin) => [fluentBit, prometheus],
      inject: [FluentBitLogSourcePlugin, PrometheusLogSourcePlugin],
    },
    LogSourcePluginRegistry,
    LogSourceService,
  ],
  exports: [LogSourceService, LogSourcePluginRegistry],
})
export class LogSourceModule {}
