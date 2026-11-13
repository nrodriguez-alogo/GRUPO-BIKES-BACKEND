import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  menuAbierto = false;
  // Propiedades requeridas por la plantilla (puedes conectar tu servicio de carrito aquí)
  cantidadTotal: number = 0;
  totalCost: number = 0;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); //Eliminar token de la sesión
    this.router.navigate(['/login']); //Regirigir al login
  }
}
