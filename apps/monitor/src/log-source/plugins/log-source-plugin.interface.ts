import { LogSourceType } from '../entities/log-source.entity';

/**
 * Every log source plugin must implement this interface.
 * Push plugins (e.g. HTTP/FluentBit) receive logs via an HTTP endpoint.
 * Pull plugins (e.g. Prometheus) are scheduled by the monitor to fetch logs.
 */
export interface ILogSourcePlugin {
    readonly type: LogSourceType;
    readonly mode: 'push' | 'pull';

    /**
     * Validates the raw config object stored in LogSource.config.
     * Returns the validated, typed config if valid.
     * Throws BadRequestException if the config is invalid.
     */
    validateConfig(raw: unknown): Record<string, unknown>;
}

/**
 * Extended interface for pull-based plugins (Prometheus, Loki, etc.).
 * The monitor scheduler calls collect() on a cadence defined by the config.
 */
export interface IPullLogSourcePlugin extends ILogSourcePlugin {
    readonly mode: 'pull';
    collect(config: Record<string, unknown>): Promise<Record<string, unknown>[]>;
}

export function isPullPlugin(plugin: ILogSourcePlugin): plugin is IPullLogSourcePlugin {
    return plugin.mode === 'pull';
}
