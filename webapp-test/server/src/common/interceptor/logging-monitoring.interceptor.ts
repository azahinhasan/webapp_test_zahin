import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMonitoringInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const { method, originalUrl, body } = req;
    const startTime = Date.now();

    console.log(`[Request] ${method} ${originalUrl}`);
    console.log(`→ Body:`, body);

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        console.log(
          `[Response] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`
        );
      }),
      catchError((err) => {
        const duration = Date.now() - startTime;
        console.error(
          `[Error] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`
        );
        console.error(`→ Error:`, err.message || err);
        return throwError(() => err);
      })
    );
  }
}
