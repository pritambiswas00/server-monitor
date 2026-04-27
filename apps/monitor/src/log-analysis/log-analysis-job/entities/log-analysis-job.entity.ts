import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { isoOwnerId, RemoteServer, type OwnerId } from '../../../remote-server/entities/remote-server.entity';
import { LogSource } from '../../../log-source/entities/log-source.entity';

export type LogAnalysisJobId = Newtype<{ readonly LogAnalysisJobId: unique symbol }, string>;
export const isLogAnalysisJobId = iso<LogAnalysisJobId>();
export const logAnalysisJobIdPipeTransformer: PipeTransform<string, LogAnalysisJobId> = {
    transform: isLogAnalysisJobId.wrap
} as const;

export enum LogAnalysisJobStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum LogAnalysisJobType {
    ONE_TIME = 'ONE_TIME',
    SCHEDULED = 'SCHEDULED'
}

@Entity({ name: 'log-analysis-job', schema: 'log-analysis-job' })
export class LogAnalysisJob {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isLogAnalysisJobId.wrap, to: isLogAnalysisJobId.unwrap } })
    id: LogAnalysisJobId;

    @Column({ type: 'uuid', transformer: { from: isoOwnerId.wrap, to: isoOwnerId.unwrap } })
    ownerId: OwnerId;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'varchar' , transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @Column({ type: 'simple-enum' })
    status: LogAnalysisJobStatus;


    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

     @OneToOne(()=> LogSource)
     @JoinColumn({ name: 'logSourceId', referencedColumnName: 'id' })
     logSource: LogSource;

     @OneToOne(()=> RemoteServer)
     @JoinColumn({ name: 'remoteServerId', referencedColumnName: 'id' })
     remoteServer: RemoteServer;
}
