import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth-service';
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService),
    router = inject(Router);
  if (!auth.token()) return router.createUrlTree(['/login']);
  return auth.refresh().pipe(
    map((r) =>
      route.data?.['admin'] && r.datos.rol !== 'administrador'
        ? router.createUrlTree(['/home'])
        : true,
    ),
    catchError(() => {
      auth.clear();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
