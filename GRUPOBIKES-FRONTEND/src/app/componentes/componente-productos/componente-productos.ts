import { Component, OnInit, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos-service';
import { Productos } from '../../interfaces/productos';


@Component({
  selector: 'app-componente-productos',
  imports: [],
  templateUrl: './componente-productos.html',
  styleUrl: './componente-productos.css',
})
export class ComponenteProductos implements OnInit {
  private router = inject(Router);
  private productoService = inject(ProductosService);
  //Signal para las secciones
  motosNuevas = signal<Productos[]>([]);
  motosUsadas = signal<Productos[]>([]); 

  imagenBaseURL = 'http://localhost:3002/imagenes/'

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.productoService.getAll().subscribe({
      next: (todos) =>{
        //Filtrar y guardar motos nuevas
        this.motosNuevas.set(
          todos.filter(prod => prod.categoria === 'Nuevas')
        );
        //Filtrar y guardar motos usadas
        this.motosUsadas.set(
          todos.filter(prod => prod.categoria === 'Usadas')
        );
      },
      error: (err) => console.error('Error al cargar el producto', err)
     });
  }
}
