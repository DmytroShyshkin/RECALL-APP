import { catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { Loading } from './loading/loading';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const loading = inject(Loading);

   loading.show();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
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