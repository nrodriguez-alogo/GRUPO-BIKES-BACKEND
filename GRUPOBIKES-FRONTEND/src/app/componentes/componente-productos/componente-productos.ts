import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos-service';
import { Productos } from '../../interfaces/productos';


@Component({
  selector: 'app-componente-productos',
  imports: [],
  templateUrl: './componente-productos.html',
  styleUrl: './componente-productos.css',
})
export class ComponenteProductos implements OnInit{
  private router = inject(Router);
  private productosService = inject(ProductosService);

  productos
}
