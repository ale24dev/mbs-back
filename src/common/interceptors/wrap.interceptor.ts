import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common';

export class WrapInterceptor implements NestInterceptor {
  
  private logger = new Logger('WrapInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
            .handle()
            .pipe(
                tap(() => this.logger.log('WrapInterceptor intercept response...')),
                map(response => ({ status: 'success', data: response }))
            );
  }
}
