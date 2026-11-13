import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { Account, AuthService } from './auth-service';
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  registerUser(data: FormData) {
    return this.auth.register(data);
  }
  getUserById(id: string) {
    return this.http.get<{ datos: Account }>(API_URL + '/usuarios/' + id);
  }
}
