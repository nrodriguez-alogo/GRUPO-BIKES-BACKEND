import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'Home', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    title: 'Home', 
    loadComponent: () => import('./componentes/Home/home').then(m => m.Home) 
  },
  { 
    path: 'anuncios', 
    title: 'Anuncios', 
    loadComponent: () => import('./componentes/anuncios/anuncios').then(m => m.Anuncios) 
  },
  { 
    path: 'login', 
    title: 'Login', 
    loadComponent: () => import('./componentes/login/login').then(m => m.Login) 
  },
  { 
    path: 'marcas', 
    title: 'Marcas', 
    loadComponent: () => import('./componentes/marcas/marcas').then(m => m.Marcas) 
  },
  { 
    path: 'productos', 
    title: 'Productos', 
    loadComponent: () => import('./componentes/productos/productos').then(m => m.Productos) 
  },
  { 
    path: 'registro', 
    title: 'Registro', 
    loadComponent: () => import('./componentes/registro/registro').then(m => m.Registro) 
  },
  { 
    path: 'usuarios', 
    title: 'Usuarios', 
    loadComponent: () => import('./componentes/usuarios/usuarios').then(m => m.Usuarios) 
  },
  { 
    path: '**', 
    title: '404 - Página no encontrada', 
    loadComponent: () => import('./componentes/page-not-found/page-not-found').then(m => m.PageNotFound) 
  }
];