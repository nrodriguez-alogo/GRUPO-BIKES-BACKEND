import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule],
  templateUrl: './recover.html',
  styleUrl: './recover.css',
})
export class Recover {
  private http = inject(HttpClient);
  recoverForm = new FormGroup({
    correo: new FormControl('',[Validators.required, Validators.email]),
  });
  mensaje = signal<string>('');
  handleRecover(){
    if(this.recoverForm.valid){
      const correo = this.recoverForm.value.correo;
      this.http.post<any>('http://localhost:3002/usuarios/olvidarContrasena',{correo}).subscribe({
        next:(res)=>{
          this.mensaje.set(res.mensaje || 'Revisa tú correo para ver la nueva contraseña');
          },
          error: (err) =>{
            this.mensaje.set('Ocurrió un error al enviar el correo');
            console.log(err);
         }
      });
    }else{
      this.mensaje.set('Por favor ingrese un correo electrónico valido');
    }
  }
}
