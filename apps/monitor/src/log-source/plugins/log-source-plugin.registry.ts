import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LogSourceType } from '../entities/log-source.entity';
import { ILogSourcePlugin } from './log-source-plugin.interface';

export const LOG_SOURCE_PLUGIN_TOKEN = 'LOG_SOURCE_PLUGINS';

@Injectable()
export class LogSourcePluginRegistry {
    private readonly registry = new Map<LogSourceType, ILogSourcePlugin>();

    constructor(@Inject(LOG_SOURCE_PLUGIN_TOKEN) plugins: ILogSourcePlugin[]) {
        for (const plugin of plugins) {
            this.registry.set(plugin.type, plugin);
        }
    }

    get(type: LogSourceType): ILogSourcePlugin {
        const plugin = this.registry.get(type);
        if (!plugin) {
            throw new BadRequestException(
                `No plugin registered for log source type: ${type}. Supported types: ${[...this.registry.keys()].join(', ')}`
            );
        }
        return plugin;
    }

    has(type: LogSourceType): boolean {
        return this.registry.has(type);
    }

    all(): ILogSourcePlugin[] {
        return [...this.registry.values()];
    }
}
