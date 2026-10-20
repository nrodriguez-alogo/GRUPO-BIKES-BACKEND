import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { required } from '@angular/forms/signals';
import { LoginService } from '../../services/login-service';
import { response } from 'express';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
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
})

//     } else {
// console.log('Error, formulario invalido');
    }
}
}
}

