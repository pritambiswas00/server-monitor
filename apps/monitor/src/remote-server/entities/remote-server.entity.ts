import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';

export type RemoteServerId = Newtype<{ readonly RemoteServerId: unique symbol }, string>;
export type OwnerId = Newtype<{ readonly OwnerId: unique symbol }, string>;
export const isoRemoteServerId = iso<RemoteServerId>();
export const isoOwnerId = iso<OwnerId>();
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

    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isoRemoteServerId.wrap, to: isoRemoteServerId.unwrap } })
    id: RemoteServerId;

    @Column({ type: 'uuid', transformer: { from: isoOwnerId.wrap, to: isoOwnerId.unwrap } })
    ownerId: OwnerId

    @Column()
    name: string;

    @Column({ type: 'varchar', nullable: true, transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @Column({ type: 'simple-json' })
    config: Record<string, unknown>;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    status: RemoteServerStatus;
}
