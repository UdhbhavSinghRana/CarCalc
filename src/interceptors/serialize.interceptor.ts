import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'

interface ClassContructor {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassContructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}