import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) throw new NotFoundException("User is not signed in");
    return request.currentUser;
})