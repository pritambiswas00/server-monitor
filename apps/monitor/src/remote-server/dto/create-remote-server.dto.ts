import { IsObject, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import * as O from 'fp-ts/Option';

export class CreateRemoteServerDto {

    @IsString()
    readonly name: string;

    @IsOptional()
    @Transform(O.fromNullable)
    @IsString()
    readonly description:  O.Option<string>;

    @IsObject()
    readonly config: Record<string, any>;


}
