import { Injectable, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs';
import { API_URL } from './api';
export interface Account {
  _id: string;
  nombre: string;
  correo: string;
  rol: 'usuario' | 'administrador';
  imagen: string;
}
export interface SessionResponse {
  resultado: string;
  mensaje: string;
  datos: string;
  usuario: Account;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platform = inject(PLATFORM_ID);
  readonly usuario = signal<Account | null>(null);
  readonly esAdmin = computed(() => this.usuario()?.rol === 'administrador');
  constructor() {
    afterNextRender(() => {
      if (this.token()) this.refresh().subscribe({ error: () => this.clear() });
    });
  }
  token(): string | null {
    if (!isPlatformBrowser(this.platform)) return null;
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }
  private accept(response: SessionResponse) {
    try {
      localStorage.setItem('token', response.datos);
    } catch {}
    this.usuario.set(response.usuario);
  }
  register(data: FormData) {
    return this.http
      .post<SessionResponse>(API_URL + '/usuarios', data)
      .pipe(tap((r) => this.accept(r)));
  }
  login(data: { username: string; contrasena: string }) {
    return this.http
      .post<SessionResponse>(API_URL + '/login', data)
      .pipe(tap((r) => this.accept(r)));
  }
  refresh() {
    return this.http
      .get<{ datos: Account }>(API_URL + '/login/me')
      .pipe(tap((r) => this.usuario.set(r.datos)));
  }
  clear() {
    if (isPlatformBrowser(this.platform)) {
      try {
        localStorage.removeItem('token');
      } catch {}
    }
    this.usuario.set(null);
  }
  logout() {
    return this.http.post(API_URL + '/login/logout', {}).pipe(finalize(() => this.clear()));
  }
}
