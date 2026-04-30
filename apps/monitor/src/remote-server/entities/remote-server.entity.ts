import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { isoUserId, type UserId } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type RemoteServerId = Newtype<{ readonly RemoteServerId: unique symbol }, string>;
export const isoRemoteServerId = iso<RemoteServerId>();
export const remoteServerIdPipeTransformer: PipeTransform<string, RemoteServerId> = {
    transform: isoRemoteServerId.wrap
} as const;

export enum RemoteServerStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    UNKNOWN = 'UNKNOWN',
};


@Entity({ name: 'remote_server', schema: 'remote_server' })
export class RemoteServer {

    @ApiProperty({ type: String })
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isoRemoteServerId.wrap, to: isoRemoteServerId.unwrap } })
    id: RemoteServerId;

    @ApiProperty({ type: String })
    @Column({ type: 'uuid', transformer: { from: isoUserId.wrap, to: isoUserId.unwrap } })
    ownerId: UserId

    @Column()
    name: string;

    @ApiProperty({ type: String, nullable: true })
    @Column({ type: 'varchar', nullable: true, transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @ApiProperty({ type: Object })
    @Column({ type: 'simple-json' })
    config: Record<string, unknown>;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ enum: RemoteServerStatus })
    @Column()
    status: RemoteServerStatus;
}
