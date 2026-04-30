import { IsEnum, IsOptional, IsString } from "class-validator";
import { LogAnalysisJobType } from "../entities/log-analysis-job.entity";
import { Transform } from "class-transformer";
import * as O from 'fp-ts/Option'
import { isLogSourceId, type LogSourceId } from "../../../log-source/entities/log-source.entity";
import { isoRemoteServerId, type RemoteServerId } from "../../../remote-server/entities/remote-server.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogAnalysisJobDto {

    @IsString({ message: 'Name must be a string', validateIf: (o) => o.name !== undefined })
    name: string;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    description: O.Option<string>;

    @ApiProperty({ enum: LogAnalysisJobType })
    @IsEnum(LogAnalysisJobType, { message: `Type must be one of ${Object.values(LogAnalysisJobType).join(', ')}` })
    type: LogAnalysisJobType;

    @ApiProperty({ type: String })
    @Transform((params) => isLogSourceId.wrap(params.value))
    @IsString({ message: 'logSourceId must be a string' })
    logSourceId: LogSourceId;

    @ApiProperty({ type: String })
    @Transform((params) => isoRemoteServerId.wrap(params.value))
    @IsString({ message: 'remoteServerId must be a string' })
    remoteServerId: RemoteServerId;
    
}
