import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    return next.handle().pipe(
      map((data) => {
        const endTime = Date.now();
        new Logger("TransformInterceptor").log(
          `TIMME:${endTime - startTime}ms\tMETHOD:${request.method}\tURL:${request.path}`,
        );
        return { data };
      }),
    );
  }
}
