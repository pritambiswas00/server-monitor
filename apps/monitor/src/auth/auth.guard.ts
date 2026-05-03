import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RequestWithUser } from './current-user.decorator';
import { isoUserId } from '@/users/entities/user.entity';
import { pipe } from 'fp-ts/function';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        return pipe(
            context.switchToHttp().getRequest<RequestWithUser>(),
            (req) => (req.user = { id: isoUserId.wrap('some-id'), name: 'John Doe', email: 'john.doe@example.com' }),
            () => true
        );
    }
}