import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Credential } from '../interfaces/credential';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor (){}
    httpClient = inject(HttpClient);
    login(credential: Credential){
      return this.httpClient.post('http://localhost:3002/inicio-sesion', credential);
    }
}
