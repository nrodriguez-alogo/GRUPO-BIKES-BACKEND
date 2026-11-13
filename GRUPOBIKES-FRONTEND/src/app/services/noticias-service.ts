import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from './api';
export interface Noticia {
  _id: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  autor: string;
  imagen: string;
  createdAt?: string;
}
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private http = inject(HttpClient);
  getAll() {
    return this.http.get<{ datos: Noticia[] }>(API_URL + '/noticias').pipe(map((r) => r.datos));
  }
  crear(data: FormData) {
    return this.http.post(API_URL + '/noticias', data);
  }
  actualizar(id: string, data: FormData) {
    return this.http.put(API_URL + '/noticias/' + id, data);
  }
  delete(id: string) {
    return this.http.delete(API_URL + '/noticias/' + id);
  }
}
