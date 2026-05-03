import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LogSourceType } from '../../entities/log-source.entity';
import { ILogSourcePlugin } from '../log-source-plugin.interface';
import { FluentBitLogSourceConfig } from './http-log-source-config.dto';

@Injectable()
export class FluentBitLogSourcePlugin implements ILogSourcePlugin {
    readonly type = LogSourceType.FLUENT_BIT;
    readonly mode = 'push' as const;

    validateConfig(raw: unknown): Record<string, unknown> {
        const instance = plainToInstance(FluentBitLogSourceConfig, raw ?? {});
        const errors = validateSync(instance);
        if (errors.length > 0) {
            const messages = errors
                .map((e) => Object.values(e.constraints ?? {}).join(', '))
                .join('; ');
            throw new BadRequestException(`Invalid Fluent Bit log source config: ${messages}`);
        }
        return instance as Record<string, unknown>;
    }
}
