import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../services/productos-service';
import {Productos} from '../../../interfaces/productos'


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
  imagenBaseURL = 'http://localhost:3002/imagenes/';
  productoForm: Productos = this.resetProducto();
  

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
   
  //Función para enviar un nuevo producto al backend. Hacer que se guarde en la base de datos del back, lo que se haga en el front
  crearProducto():void{
    const file = this.selectedFile();
    if(!file){
      alert('Por favor selecciona una imagen');
      return;
    }
    //Constante para enviar los archivos físicos junto con el texto por el HTTP
    const formData= new FormData();
    formData.append('marca', this.productoForm.marca);
    formData.append('modelo', this.productoForm.modelo);
    formData.append('descripcion', this.productoForm.descripcion);
    formData.append('imagen', file);
    formData.append('color', this.productoForm.color);
    formData.append('categoria', this.productoForm.categoria);
    formData.append('precio', this.productoForm.precio.toString());
    formData.append('estado', this.productoForm.estado);
    formData.append('cilindraje', this.productoForm.cilindraje.toString());
    this.productosService.crear(formData).subscribe({
    next: () =>{
      alert('Producto creado correctamente');
      this.cancelarFormulario();
      this.obtenerProductos();
      },
      error:(err)=>{
        console.log("Error al crear el producto", err);
        alert('Error al crear el producto');
      }
    });
  }

  actualizarProducto():void{
    if(!this.productoForm._id){
      alert('No se encontró el ID del producto');
      return;
    }
    const formData = new FormData();
    formData.append('modelo', this.productoForm.modelo);
    formData.append('descripcion', this.productoForm.descripcion);
    formData.append('color', this.productoForm.color);
    formData.append('categoria', this.productoForm.categoria);
    formData.append('precio', this.productoForm.precio.toString());
    formData.append('estado', this.productoForm.estado);
    formData.append('cilindraje', this.productoForm.cilindraje.toString());
    formData.append('marca', this.productoForm.marca);

    const file = this.selectedFile();
    if(file){
      formData.append('imagen', file);
    }
    this.productosService.actualizar(this.productoForm._id, formData).subscribe({
      next: () =>{
        alert('Producto se actualizado correctamente');
        this.cancelarFormulario();
        this.obtenerProductos();
      },
      error:(err)=>{
        console.log('Error al actualizar el producto', err);
        alert("Error al actualizar el producto");
      }
    });
  }

  eliminarProducto(id: string):void{
    if(confirm('¿Estás seguro de eliminar este producto?')){
      this.productosService.delete(id).subscribe({
        next: ()=>{
          this.obtenerProductos();
        },
        error: (err)=> console.log('Error al eliminar', err)
      })
    }

  }

  resetProducto(): Productos{
    return{
      marca: '',
      modelo: '',
      descripcion: '',
      imagen: '',
      color: '',
      categoria: '',
      precio: 0,
      estado: '',
      cilindraje: 0
    };
  }
  prepararCrear(): void{
    this.modo.set('crear');//La lógica ejecuta el restro del producto
    this.productoForm = this.resetProducto();//Limpiar datos
    this.selectedFile.set(null) //Reiniciar signal del archivo
    this.mostrarFormulario.set(true)//Hacer que el formulario sea visible en la pantalla del HTML
  }
  //Función para cargar en el formulario de edición
  seleccionarParaEditar(producto: Productos):void{
    this.modo.set('editar');
    this.productoForm = {...producto};//operador sprit"..."
    this.selectedFile.set(null);//Por si el usuario no quiere cambiar la imagen y desea conservar la actual
    this.mostrarFormulario.set(true);
  }
  //Método para cerrar y cancelar el formulario
  cancelarFormulario():void{
    this.mostrarFormulario.set(false);// Para que se oculte el formulario
    this.productoForm = this.resetProducto();
    this.selectedFile.set(null);//Reiniciar el objeto del formulario
  }
  

}
