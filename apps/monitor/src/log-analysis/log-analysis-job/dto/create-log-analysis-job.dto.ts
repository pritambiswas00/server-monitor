import { IsEnum, IsOptional, IsString } from "class-validator";
import { LogAnalysisJobType } from "../entities/log-analysis-job.entity";
import { Transform } from "class-transformer";
import * as O from 'fp-ts/Option'
import { isLogSourceId } from "../../../log-source/entities/log-source.entity";
import { isoRemoteServerId } from "../../../remote-server/entities/remote-server.entity";

export class CreateLogAnalysisJobDto {

    @IsString({ message: 'Name must be a string', validateIf: (o) => o.name !== undefined })
    name: string;

    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    description: O.Option<string>;

    @IsEnum(LogAnalysisJobType, { message: `Type must be one of ${Object.values(LogAnalysisJobType).join(', ')}` })
    type: LogAnalysisJobType;

    @Transform((params) => isLogSourceId.wrap(params.value))
    @IsString({ message: 'logSourceId must be a string' })
    logSourceId: string;


    @Transform((params) => isoRemoteServerId.wrap(params.value))
    @IsString({ message: 'remoteServerId must be a string' })
    remoteServerId: string;
    
}
