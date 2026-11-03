import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../services/productos-service';
import { productos } from '../../../interfaces/productos';
import { Productos } from '../../productos/productos';

@Component({
  selector: 'app-crud-productos',
  imports: [FormsModule],
  templateUrl: './crud-productos.html',
  styleUrl: './crud-productos.css',
})
export class CrudProductos {
  private productosService = inject(ProductosService);
  productos = signal<Productos[]>([]);
  mostrarFormulario = signal<boolean>(false);
  modo = signal <'crear' | 'editar'>('crear');
  selectedFile = signal<File | null>(null);
  imagenBaseURL = 'http://localhost:3002/imagenes';
  ngOnInit():void{
    this.obtenerProductos();
  }

  obtenerProductos():void{
    this.productosService.getAll().subscribe({
      next:(resp)=>{
        this.productos.set(resp);
      },
      error: (err)=> console.error("Error al cargar productos", err)
    });
  }
  onFileSelected(event: Event):void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      this.selectedFile.set(input.files[0]);
    }
  }
}
