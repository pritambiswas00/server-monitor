import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { type OwnerId, isoOwnerId } from '../../remote-server/entities/remote-server.entity';

export type LogSourceId = Newtype<{ readonly LogSourceId: unique symbol }, string>;
export const isLogSourceId = iso<LogSourceId>();
export const remoteServerIdPipeTransformer: PipeTransform<string, LogSourceId> = {
    transform: isLogSourceId.wrap
} as const;

export enum LogStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    UNKNOWN = 'UNKNOWN'
}

export enum LogSourceType {
     PROMETHEUS = 'PROMETHEUS'
}

@Entity({ name: 'log-source', schema: 'log-source' })
export class LogSource {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isLogSourceId.wrap, to: isLogSourceId.unwrap } })
    id: LogSourceId;

    @Column({ type: 'uuid', transformer: { from: isoOwnerId.wrap, to: isoOwnerId.unwrap } })
    ownerId: OwnerId

    @Column()
    name: string;

    @Column({ nullable: true, transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @Column({ type: 'simple-enum' })
    status: LogStatus;

    @Column({ type: 'simple-enum' })
    type: LogSourceType;

    @Column({ type: 'simple-json' })
    config: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
