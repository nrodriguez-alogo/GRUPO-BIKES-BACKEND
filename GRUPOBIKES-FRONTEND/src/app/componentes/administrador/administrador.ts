import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { imageUrl } from '../../services/api';
import { CrudProductos } from './crud-productos/crud-productos';
import { CrudNoticias } from './crud-noticias/crud-noticias';
@Component({
  selector: 'app-administrador',
  imports: [CrudProductos, CrudNoticias, RouterLink],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css',
})
export class Administrador {
  auth = inject(AuthService);
  private router = inject(Router);
  tab: 'productos' | 'noticias' = 'productos';
  adminName = () => this.auth.usuario()?.nombre || 'Administrador';
  adminImage = () => imageUrl(this.auth.usuario()?.imagen);
  logout() {
    this.auth
      .logout()
      .subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: () => this.router.navigateByUrl('/login'),
      });
  }
}
