import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';
  registerUser(formData: FormData): Observable<ServerResponse> {
    return this.httpClient.post<ServerResponse>(this.apiUrl, formData);
  }
  getUserById(id:string): Observable<ServerResponse> {
    return this.httpClient.get<ServerResponse>(`${this.apiUrl}/${id}`);
  }
}
