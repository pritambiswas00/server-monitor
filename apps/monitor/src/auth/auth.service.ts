import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    login(email: string) {
        return pipe(
            this.usersService.findByEmail(email),
            TE.flatMap((maybeUser) =>
                pipe(
                    maybeUser,
                    O.match(
                        () => TE.left(new NotFoundException(`No account found for email: ${email}`)),
                        (user) => TE.right(user)
                    )
                )
            )
        );
    }
}
