import { Routes } from '@angular/router';
import { Home } from './componentes/home/home';
import { authGuard } from './guards/auth-guard';
export const routes: Routes = [
  { path: 'home', title: 'Grupo Bikes', component: Home },
  { path: 'anuncios', redirectTo: 'noticias', pathMatch: 'full' },
  {
    path: 'noticias',
    title: 'Noticias | Grupo Bikes',
    loadComponent: () => import('./componentes/anuncios/anuncios').then((m) => m.Anuncios),
  },
  {
    path: 'login',
    title: 'Iniciar sesión | Grupo Bikes',
    loadComponent: () => import('./componentes/login/login').then((m) => m.Login),
  },
  {
    path: 'marcas',
    title: 'Marcas | Grupo Bikes',
    loadComponent: () => import('./componentes/marcas/marcas').then((m) => m.Marcas),
  },
  {
    path: 'productos',
    title: 'Catálogo | Grupo Bikes',
    loadComponent: () =>
      import('./componentes/componente-productos/componente-productos').then(
        (m) => m.ComponenteProductos,
      ),
  },
  {
    path: 'registro',
    title: 'Crear cuenta | Grupo Bikes',
    loadComponent: () => import('./componentes/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'usuarios',
    title: 'Mi cuenta | Grupo Bikes',
    loadComponent: () => import('./componentes/usuarios/usuarios').then((m) => m.Usuarios),
    canActivate: [authGuard],
  },
  {
    path: 'administrador',
    title: 'Administración | Grupo Bikes',
    loadComponent: () =>
      import('./componentes/administrador/administrador').then((m) => m.Administrador),
    canActivate: [authGuard],
    data: { admin: true },
  },
  {
    path: 'recover',
    title: 'Recuperar cuenta | Grupo Bikes',
    loadComponent: () => import('./componentes/recover/recover').then((m) => m.Recover),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./componentes/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
