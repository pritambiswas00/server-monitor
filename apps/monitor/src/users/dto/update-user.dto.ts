import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import * as O from 'fp-ts/Option';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString({ message: "Please provide valid name"  })
    name: O.Option<string>;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsEmail({ allow_display_name: true })
    @IsString({ message: "Please provide valid email"  })
    email: O.Option<string>;
}
