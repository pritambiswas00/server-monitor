import { type PipeTransform } from '@nestjs/common';
import { iso, type Newtype } from 'newtype-ts';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export type UserId = Newtype<{ readonly UserId: unique symbol }, string>;
export const isoUserId = iso<UserId>();
export const userIdPipeTransformer: PipeTransform<string, UserId> = {
     transform: isoUserId.wrap
} as const;

@Entity({ name: 'user', schema: 'user' })
export class User {

    @PrimaryColumn({ type: 'uuid', generated: 'uuid', transformer: { from: isoUserId.wrap , to: isoUserId.unwrap }})
    readonly id: UserId;

    @Column()
    readonly name: string;

    @Column()
    readonly email: string;
}
