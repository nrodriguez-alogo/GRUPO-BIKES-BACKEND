import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-administrador',
  imports: [],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css',
})
export class Administrador implements OnInit{
  private router = inject(Router);
  adminName = signal<string>('Administrador');
  adminImage = signal<string>('http://localhost:3000/imagenes/usuarios/default-user.svg');
  ngOnInit(): void {
    this.loadAdminData(): void;
  }
  private userService = inject(UserService);

  logout(){
       localStorage.removeItem('token'); //Eliminar token de la sesión
       this.router.navigate(['/login']);//Regirigir al login
   }
}
