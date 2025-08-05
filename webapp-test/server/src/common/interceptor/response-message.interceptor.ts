import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && data.message) {
          return data; 
        }

        let message = 'Success';

        if (data && Array.isArray(data.data) && data.data.length === 0) {
          message = 'No data found';
        } else {
          switch (request.method) {
            case 'POST':
              message = 'Created successfully';
              break;
            case 'PATCH':
              message = 'Updated successfully';
              break;
            case 'DELETE':
              message = 'Deleted successfully';
              break;
            case 'GET':
              message = 'Fetched successfully';
              break;
          }
        }

        return { ...data, message };
      }),
    );
  }
}
