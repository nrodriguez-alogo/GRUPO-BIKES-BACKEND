import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login-service';





@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  loginService: LoginService = inject(LoginService);
  CredentialsForm = new FormGroup({
    username: new FormControl('', Validators. required),
    contrasena: new FormControl('', Validators. required),
  });

  handleSubmit(){
   //console.log("funciona(works)");
   console.log(this.CredentialsForm);
    if (this.CredentialsForm.valid){
    const username = this.CredentialsForm.value.username;
    const contrasena = this.CredentialsForm.value.contrasena;

    if(typeof username === 'string' && typeof contrasena === 'string'){//Si username y contrasena es exactamente igual a tipo string. Será de tipo string y validará la constante credential 
    const credential: Credential = {
        username,
        contrasena,
  };
  // console.log(credential);
 this.loginService.login(credential).subscribe((response: any)=> {
     console.log("response: ", response);
    if(response.resultado === 'bien'){
      localStorage.setItem('token', response.datos);
      const decoded: any = this.loginService.decodeToken(response.datos)
      console.log('Token decodificado', decoded);
      if(decoded.rol === 'administrador'){
        this.router.navigateByUrl('/administrador');//Crear ruta del administrador
        } else{
          alert("Redirigiendo al home");
          this.router.navigateByUrl('/home');
        }          
      }else{
       console.log('No funcionó');
     }
      
});

} else {
 console.log('Error, formulario invalido');
    }
}
}
}

