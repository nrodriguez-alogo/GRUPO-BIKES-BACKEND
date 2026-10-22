import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-navegacion',
  imports: [
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  // Propiedades requeridas por la plantilla (puedes conectar tu servicio de carrito aquí)
  cantidadTotal: number = 0;
  totalCost: number = 0;

   constructor(private router: Router){}

     logout(){
       localStorage.removeItem('token'); //Eliminar token de la sesión
       this.router.navigate(['/login']);//Regirigir al login
   }


}