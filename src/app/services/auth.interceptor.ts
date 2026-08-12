import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { Loading } from './loading/loading';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const loading = inject(Loading);
  const authService = inject(AuthService);

  loading.show();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 403) {

          localStorage.removeItem('token');
          router.navigate(['/login']);

        } else if (error.status === 401) {

          if (req.url.includes('/auth/refresh')) {
            localStorage.removeItem('token');
            router.navigate(['/login']);
          } else {

            return authService.refresh().pipe(
              switchMap((response) => {
                authService.setToken(response.accessToken);
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${response.accessToken}` }
                });
                return next(retryReq);
              }),
              catchError((refreshError) => {
                localStorage.removeItem('token');
                router.navigate(['/login']);
                return throwError(() => refreshError);
              })
            )
          }
        }
        return throwError(() => error);
      }),
      finalize(() => loading.hide())
    );
  }

  return next(req).pipe(
    finalize(() => loading.hide())
  );
};