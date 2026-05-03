import { IsEnum, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoteServerConfigDto {
    @ApiProperty({ example: 'host.docker.internal' })
    @IsString()
    host: string;

    @ApiProperty({ example: 4000 })
    @IsInt()
    port: number;

    @ApiProperty({ enum: ['http', 'https'], example: 'http' })
    @IsEnum(['http', 'https'])
    protocol: 'http' | 'https';
}
