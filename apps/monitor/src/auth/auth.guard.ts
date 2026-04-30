import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import type { RequestWithUser } from "./current-user.decorator";
import { isoUserId } from "@/users/entities/user.entity";
import { pipe } from "fp-ts/function";


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        return pipe(
            context.switchToHttp().getRequest<RequestWithUser>(),
            (req) => req.user = ({ id: isoUserId.wrap("some-id"), name: 'John Doe', email: "john.doe@example.com" }),
            (user) => true
        )
    }
}