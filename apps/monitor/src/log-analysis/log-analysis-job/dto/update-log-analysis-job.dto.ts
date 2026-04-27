import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import * as O from 'fp-ts/Option'

export class UpdateLogAnalysisJobDto {
     
    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString({ message: 'Name must be a string', validateIf: (o) => o.name !== undefined })
    name: O.Option<string>;

    @Transform((params) => O.fromNullable(params.value))
    @IsOptional()
    @IsString({ message: 'Description must be a string', validateIf: (o) => o.description !== undefined })
    description: O.Option<string>;
}
