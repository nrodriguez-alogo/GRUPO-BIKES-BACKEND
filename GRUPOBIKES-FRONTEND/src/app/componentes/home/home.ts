import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [ ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // constructor(private router: Router){}

  //  logout(){
  //   localStorage.removeItem('token'); //Eliminar token de la sesión
  //     this.router.navigate(['/login']);//Regirigir al login
  //  }
}

