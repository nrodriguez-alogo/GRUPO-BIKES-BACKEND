import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { imageUrl } from '../../services/api';
@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  auth = inject(AuthService);
  imageUrl = imageUrl;
}
