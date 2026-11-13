import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductosService } from '../../services/productos-service';
import { Productos } from '../../interfaces/productos';
@Component({
  selector: 'app-componente-productos',
  imports: [CurrencyPipe],
  templateUrl: './componente-productos.html',
  styleUrl: './componente-productos.css',
})
export class ComponenteProductos implements OnInit {
  private servicio = inject(ProductosService);
  productos = signal<Productos[]>([]);
  cargando = signal(true);
  error = signal(false);
  imagenBaseURL = 'http://localhost:3002/imagenes/';
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio.getAll().subscribe({
      next: (datos) => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}
