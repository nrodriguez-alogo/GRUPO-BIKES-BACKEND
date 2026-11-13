import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from './auth-service';
import { API_URL } from './api';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const own = req.url === API_URL || req.url.startsWith(API_URL + '/');
  const token = own ? auth.token() : null;
  return next(token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req).pipe(
    tap({
      error: (error) => {
        if (own && error.status === 401 && req.url !== API_URL + '/login') auth.clear();
      },
    }),
  );
};
