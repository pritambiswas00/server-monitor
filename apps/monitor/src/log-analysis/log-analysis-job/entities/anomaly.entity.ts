

import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as O from 'fp-ts/Option';
import { RemoteServer } from '../../../remote-server/entities/remote-server.entity';
import { LogSource } from '../../../log-source/entities/log-source.entity';
import { isoUserId, type UserId } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { LogAnalysisJob } from './log-analysis-job.entity';

export type AnomalyId = Newtype<{ readonly AnomalyId: unique symbol }, string>;
export const isAnomalyId = iso<AnomalyId>();
export const AnomalyIdPipeTransformer: PipeTransform<string, AnomalyId> = {
    transform: isAnomalyId.wrap
} as const;

export enum AnomalySeverity {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

@Entity({ name: 'anomaly', schema: 'anomaly' })
export class Anomaly {
    @ApiProperty({ type: String })
    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isAnomalyId.wrap, to: isAnomalyId.unwrap } })
    id: AnomalyId;

    @Column()
    title: string;

    @ApiProperty({ type: String, nullable: true })
    @Column({ nullable: true, type: 'varchar', transformer: { from: O.fromNullable, to: O.toNullable } })
    description: O.Option<string>

    @ApiProperty({ enum: AnomalySeverity })
    @Column({ type: 'simple-enum', enum: AnomalySeverity })
    severity: AnomalySeverity;

    @ManyToOne(() => LogAnalysisJob, (logAnalysisJob) => logAnalysisJob.id, { onDelete: 'CASCADE' })
    logAnalysisJob: LogAnalysisJob;

    @Column({ type: 'simple-json', nullable: true, transformer: { from: O.fromNullable, to: O.toNullable } })
    ticketInformation: O.Option<Record<string, unknown>>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
