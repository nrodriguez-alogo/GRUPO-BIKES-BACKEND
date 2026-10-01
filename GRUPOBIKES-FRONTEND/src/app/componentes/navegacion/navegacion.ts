import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-navegacion',
  imports: [
    RouterLink,
    RouterLinkActive,
    DecimalPipe
  ],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  // Propiedades requeridas por la plantilla (puedes conectar tu servicio de carrito aquí)
  cantidadTotal: number = 0;
  totalCost: number = 0;
}