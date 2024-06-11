import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/*
 * Error interceptor for HTTP requests
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 400:
          return throwError(() => '400 Bad Request: Invalid input');
        case 401:
          return throwError(() => '401 Unauthorized: Invalid username or password');
        case 403:
          return throwError(() => '403 Forbidden: You do not have permission to access this resource');
        case 404:
          return throwError(() => '404 Not Found: The requested resource could not be found');
        case 500:
          return throwError(() => '500 Internal Server Error: An unexpected error occurred');
        default:
          return throwError(() => 'An unexpected error occurred');
      }
    })
  );
};
