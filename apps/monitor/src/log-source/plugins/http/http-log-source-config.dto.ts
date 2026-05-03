import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FluentBitProtocol {
    HTTP = 'http',
    HTTPS = 'https',
}

/**
 * Config shape for Fluent Bit (HTTP push) log sources.
 * The user selects this when they have Fluent Bit tailing logs on the remote server
 * and pushing to a monitor ingest endpoint.
 */
export class FluentBitLogSourceConfig {
    @ApiProperty({
        enum: FluentBitProtocol,
        description: 'Protocol the monitor ingest endpoint is served on',
    })
    @IsEnum(FluentBitProtocol, { message: 'protocol must be http or https' })
    protocol: FluentBitProtocol;

    @ApiProperty({
        type: String,
        description: 'Ingest route path Fluent Bit POSTs to, e.g. /log-analysis/ingest',
        default: '/log-analysis/ingest',
    })
    @IsString({ message: 'ingestPath must be a string' })
    ingestPath: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'Optional bearer token Fluent Bit must include in the Authorization header',
    })
    @IsOptional()
    @IsString()
    authToken?: string;
}
