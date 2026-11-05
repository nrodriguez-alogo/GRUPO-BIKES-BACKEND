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
  adminImage = signal<string>('http://localhost:3002/imagenes/usuarios/default-user.svg');
  ngOnInit(): void {
    this.loadAdminData(); 
  }
  loadAdminData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Token decodificado en admin: ", decoded);
        if (decoded.nombre {
          this.adminName.set(decoded.nombre);
        }
        if(decoded.imagen) {
          const imageUrl =`http://localhost:3002/${decoded.imagen}`;
          this,this.adminImage.set(imageUrl);
        }
        if (decoded.id) {
          this.userService.getUserById(decoded.id).subscribe({
            next: (response) => {
              if (response.mensaje === 'bien' && response.datos.nombre){
                this.adminName.set(response.datos.nombre);
                if (response.datos.imagen) {
                  this.adminImage.set(`http://localhost:3002/${response.datos.imagen}`);
                }
            }
          },
        error: (err) => console.error('Error al obtener datos el admin: ', err)
        });
        }
      }catch (error) {
        console.error("Error al decodificar el token: ", error);
      }
    }
  }

  private userService = inject(UserService);

  logout(){
       localStorage.removeItem('token'); //Eliminar token de la sesión
       this.router.navigate(['/login']);//Regirigir al login
   }
}
