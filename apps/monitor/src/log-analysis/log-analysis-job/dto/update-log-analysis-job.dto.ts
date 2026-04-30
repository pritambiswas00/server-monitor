import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import * as O from 'fp-ts/Option'
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLogAnalysisJobDto {
     
    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString({ message: 'Name must be a string', validateIf: (o) => o.name !== undefined })
    name: O.Option<string>;

    @ApiProperty({ type: String, required: false })
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString({ message: 'Description must be a string', validateIf: (o) => o.description !== undefined })
    description: O.Option<string>;
}
