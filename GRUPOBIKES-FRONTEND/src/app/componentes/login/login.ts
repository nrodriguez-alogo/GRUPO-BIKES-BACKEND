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
    password: new FormControl('', Validators. required),
  });

  handleSubmit(){
   //console.log("funciona(works)");
   console.log(this.CredentialsForm);
    if (this.CredentialsForm.valid){
    const username = this.CredentialsForm.value.username;
    const password = this.CredentialsForm.value.password;

    if(typeof username === 'string' && typeof password === 'string'){//Si username y password es exactamente igual a tipo string. Será de tipo string y validará la constante credential 
    const credential: Credential = {
        username,
        password,
  };
  console.log(credential);
  this.loginService.login(credential).subscribe((response: any)=> {
    console.log("response: ", response);
  })

    } else {
    console.log('Error, formulario invalido');
    }
  }
}
}

