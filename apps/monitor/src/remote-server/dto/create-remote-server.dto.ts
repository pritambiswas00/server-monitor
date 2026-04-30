import { IsObject, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import * as O from 'fp-ts/Option';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRemoteServerDto {

    @IsString()
    readonly name: string;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    readonly description:  O.Option<string>;

    @ApiProperty({ type: Object })
    @IsObject()
    readonly config: Record<string, any>;


}
