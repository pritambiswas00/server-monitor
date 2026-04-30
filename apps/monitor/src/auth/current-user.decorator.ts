import { createParamDecorator, ExecutionContext, Request } from "@nestjs/common";
import { User } from "@/users/entities/user.entity";

export interface RequestWithUser extends Request {
    user: User;
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext)=> {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
})