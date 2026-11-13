import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navegacion } from './componentes/navegacion/navegacion';
import { Footer } from './componentes/footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Navegacion, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('GRUPOBIKES-FRONTEND');
}
