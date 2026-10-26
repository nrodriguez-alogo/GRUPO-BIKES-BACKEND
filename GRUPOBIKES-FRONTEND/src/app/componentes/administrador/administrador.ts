import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-administrador',
  imports: [],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css',
})
export class Administrador {
  private router = inject(Router);

  logout(){
       localStorage.removeItem('token'); //Eliminar token de la sesión
       this.router.navigate(['/login']);//Regirigir al login
   }
}
