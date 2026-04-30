import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import * as O from 'fp-ts/Option';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRemoteServerDto {
    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    readonly name: O.Option<string>;


    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    readonly description: O.Option<string>;
}
