import { HttpClient, provideHttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Credential } from '../interfaces/credential';
import {jwtDecode} from 'jwt-decode';



@Injectable({
  providedIn: 'root',
})
export class LoginService {

    constructor (){}
    httpClient = inject(HttpClient);
    login(credential: Credential){
      return this.httpClient.post('http://localhost:3002/login', credential);
    }
    decodeToken (token: string): any{
    return jwtDecode(token);
  }
}
