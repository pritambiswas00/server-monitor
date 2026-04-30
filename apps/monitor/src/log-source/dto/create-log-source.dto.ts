import * as O from 'fp-ts/Option'
import { LogSourceType } from '../entities/log-source.entity';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogSourceDto {

    @IsString({ message: 'Please provide valid name' })
    name: string;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    description: O.Option<string>;

    @ApiProperty({ type: Object })
    @IsObject()
    config: Record<string, any>;

    @ApiProperty({ enum: LogSourceType })
    @IsEnum(LogSourceType, { message: 'Please provide valid log source type' })
    type: LogSourceType
}
