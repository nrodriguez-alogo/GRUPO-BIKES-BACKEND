import { Routes } from '@angular/router';
import { Home } from './componentes/home/home';
import { Anuncios } from './componentes/anuncios/anuncios';
import { Login } from './componentes/login/login';
import { Marcas } from './componentes/marcas/marcas';
import { Navegacion } from './componentes/navegacion/navegacion';
import { Footer } from './componentes/footer/footer';  
import { Productos } from './componentes/productos/productos';
import { Registro } from './componentes/registro/registro';
import { Usuarios } from './componentes/usuarios/usuarios';
import { PageNotFound } from './componentes/page-not-found/page-not-found';

export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    {path: 'anuncios', title: 'Anuncios', component: Anuncios},
    {path: 'login', title: 'Login', component: Login},
    {path: 'marcas', title: 'Marcas', component: Marcas},
    {path: 'navegacion', title: 'Navegacion', component: Navegacion},
    {path: 'productos', title: 'Productos', component: Productos},
    {path: 'registro', title: 'Registro', component: Registro},
    {path: 'usuarios', title: 'Usuarios', component: Usuarios},
    {path: '', redirectTo: 'Home', pathMatch: 'full'},
    {path: '**', title: '404', component: PageNotFound},
    {path: 'footer', title: 'Footer', component: Footer}
];
