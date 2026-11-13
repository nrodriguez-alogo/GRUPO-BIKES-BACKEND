import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  auth = inject(AuthService);
  private router = inject(Router);
  menuAbierto = false;
  logout() {
    this.menuAbierto = false;
    this.auth
      .logout()
      .subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: () => this.router.navigateByUrl('/login'),
      });
  }
}
