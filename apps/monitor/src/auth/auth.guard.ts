import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import type { RequestWithUser } from "./current-user.decorator";
import { isoUserId } from "../users/entities/user.entity";


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        request.user = ({ id: isoUserId.wrap("some-id"), name: 'John Doe', email: 'john.doe@example.com' });
        return true; // Allow access for now, replace with actual logic
    }
}