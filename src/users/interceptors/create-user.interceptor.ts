import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CreateUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session;

        if (userId) {
            const user = this.userService.findOne(userId);
            request.currentUser = user;
        }

        return handler.handle();
    }
}