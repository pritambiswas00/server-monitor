import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from 'class-transformer';
import * as O from 'fp-ts/Option';
import { ApiProperty } from '@nestjs/swagger';
import { RemoteServerConfigDto } from './remote-server-config.dto';

export class CreateRemoteServerDto {

    @IsString()
    readonly name: string;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString()
    readonly description: O.Option<string>;

    @ApiProperty({ type: RemoteServerConfigDto })
    @ValidateNested()
    @Type(() => RemoteServerConfigDto)
    readonly config: RemoteServerConfigDto;
}
