import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { RemoteServer } from '../../../remote-server/entities/remote-server.entity';
import { LogSource } from '../../../log-source/entities/log-source.entity';
import { isoUserId, type UserId } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Anomaly } from './anomaly.entity';

export type LogAnalysisJobId = Newtype<{ readonly LogAnalysisJobId: unique symbol }, string>;
export const isLogAnalysisJobId = iso<LogAnalysisJobId>();
export const logAnalysisJobIdPipeTransformer: PipeTransform<string, LogAnalysisJobId> = {
    transform: isLogAnalysisJobId.wrap
} as const;

export enum LogAnalysisJobStatus {
    INITIALIZED = "INITIALIZED",
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
    @ApiProperty({ type: String })
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isLogAnalysisJobId.wrap, to: isLogAnalysisJobId.unwrap } })
    id: LogAnalysisJobId;

    @ApiProperty({ type: String })
    @Column({ type: 'uuid', transformer: { from: isoUserId.wrap, to: isoUserId.unwrap } })
    ownerId: UserId;

    @Column()
    name: string;

    @ApiProperty({ type: String, nullable: true })
    @Column({ nullable: true, type: 'varchar', transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @ApiProperty({ type: Object, nullable: true })
    @Column({ type: 'simple-json', nullable: true, transformer: { from: O.fromNullable, to: O.toNullable } })
    ticketSystemConfig: O.Option<Record<string, unknown>>

    @ApiProperty({ enum: LogAnalysisJobStatus })
    @Column({ type: 'simple-enum', enum: LogAnalysisJobStatus })
    status: LogAnalysisJobStatus;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => LogSource)
    @JoinColumn({ name: 'logSourceId', referencedColumnName: 'id' })
    logSource: LogSource;

    @OneToOne(() => RemoteServer)
    @JoinColumn({ name: 'remoteServerId', referencedColumnName: 'id' })
    remoteServer: RemoteServer;

    @OneToMany(() => Anomaly, (anomaly) => anomaly.logAnalysisJob)
    anomalies: Anomaly[];
}
