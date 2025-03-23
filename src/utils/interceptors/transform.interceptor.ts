import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const SKIP_TRANSFORM_INTERCEPTOR = 'skipTransformInterceptor';

export function SkipTransformInterceptor() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(SKIP_TRANSFORM_INTERCEPTOR, true, descriptor.value);
    return descriptor;
  };
}

export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const handler = context.getHandler();
    const skipInterceptor = this.reflector.get<boolean>(
      SKIP_TRANSFORM_INTERCEPTOR,
      handler,
    );

    if (skipInterceptor) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Xử lý trường hợp data là null hoặc undefined
        if (data === null || data === undefined) {
          // Xử lý đặc biệt cho DELETE request
          if (request.method === 'DELETE') {
            return {
              data: null,
              statusCode: statusCode,
              message: 'Deleted successfully',
              timestamp: new Date().toISOString(),
            };
          }

          return {
            data: null,
            statusCode: statusCode,
            message: this.getDefaultMessageForStatusCode(statusCode),
            timestamp: new Date().toISOString(),
          };
        }

        // Xử lý message tùy chỉnh
        const message = data.message || this.getDefaultMessageForStatusCode(statusCode);

        // Xử lý data
        const responseData = data.data !== undefined ? data.data : data;

        return {
          data: responseData,
          statusCode: statusCode,
          message: message,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getDefaultMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Success';
      case 201:
        return 'Created';
      case 202:
        return 'Accepted';
      case 204:
        return 'No Content';
      default:
        return 'Success';
    }
  }
}
