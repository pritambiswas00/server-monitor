import * as O from 'fp-ts/Option'
import { LogSourceType } from '../entities/log-source.entity';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLogSourceDto {

    @IsString({ message: 'Please provide valid name' })
    name: string;

    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    description: O.Option<string>;

    @IsObject()
    config: Record<string, any>;

    
    @IsEnum(LogSourceType)
    type: LogSourceType
}
