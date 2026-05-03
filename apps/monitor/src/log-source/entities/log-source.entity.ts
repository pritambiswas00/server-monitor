import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { isoUserId, type UserId } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RemoteServer, isoRemoteServerId, type RemoteServerId } from '@/remote-server/entities/remote-server.entity';

export type LogSourceId = Newtype<{ readonly LogSourceId: unique symbol }, string>;
export const isLogSourceId = iso<LogSourceId>();
export const logSourceIdPipeTransformer: PipeTransform<string, LogSourceId> = {
    transform: isLogSourceId.wrap
} as const;

export enum LogStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    UNKNOWN = 'UNKNOWN'
}

export enum LogSourceType {
     PROMETHEUS = 'PROMETHEUS',
     FLUENT_BIT = 'FLUENT_BIT',
}

@Entity({ name: 'log-source', schema: 'log-source' })
export class LogSource {
    @ApiProperty({ type: String })
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isLogSourceId.wrap, to: isLogSourceId.unwrap } })
    id: LogSourceId;

    @ApiProperty({ type: String })
    @Column({ type: 'uuid', transformer: { from: isoUserId.wrap, to: isoUserId.unwrap } })
    ownerId: UserId

    @Column()
    name: string;

    @ApiProperty({ type: String, nullable: true })
    @Column({ nullable: true, type: 'varchar',  transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @ApiProperty({ enum: LogStatus })
    @Column({ type: 'simple-enum' })
    status: LogStatus;

    @ApiProperty({ enum: LogSourceType })
    @Column({ type: 'simple-enum' })
    type: LogSourceType;

    @ApiProperty({ type: Object })
    @Column({ type: 'simple-json' })
    config: Record<string, unknown>;

    @ApiProperty({ type: String })
    @Column({ type: 'uuid', transformer: { from: isoRemoteServerId.wrap, to: isoRemoteServerId.unwrap } })
    remoteServerId: RemoteServerId;

    @ManyToOne(() => RemoteServer)
    @JoinColumn({ name: 'remoteServerId', referencedColumnName: 'id' })
    remoteServer: RemoteServer;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
