import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  router = inject(Router);
  private fb = inject(FormBuilder);
  private userService =inject(UserService);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  registerForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
    rol: [''] //Opcional, nunca inicia vacio y no lleva validators
  });

  onFileSelected(event: Event): void{
    const input =event.target as HTMLInputElement;
    if (input.files && input.files.length > 0){
      const file = input.files[0];
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }else{
      this.selectedFile.set(null);
      this.imagePreview.set(null);
    }
  }
 
  onSubmit(): void {
    if (this.registerForm.invalid){
      alert('Por favor completa los campos obligatorios (Nombre, Correo y Contraseña)');
      return;
    }
    const datos = this.registerForm.getRawValue();
    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('correo', datos.correo);
    formData.append('contrasena', datos.contrasena);
    if (datos.rol) {
      formData.append('rol', datos.rol);
    }
    const file = this.selectedFile();
    if (file) {
      formData.append('imagen', file);
    }
    console.log('Datos con FormBuilder:', datos, 'Archivo', file);
    this.userService.registerUser(formData)
    .subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.mensaje === 'bien'){
          alert('¡Usuario registrado con éxito!');
          this.router.navigate(['/login']);
        }else {
          alert('Ocurrio lo siguiente: ' + response.mensaje);
        }
      },
      error: (err) => {
        console.error('Error de red o del servidor: ', err);
        alert('Ocurrió un error en el servidor al intentar registrar el usuario');
      }
    });
  }

}
