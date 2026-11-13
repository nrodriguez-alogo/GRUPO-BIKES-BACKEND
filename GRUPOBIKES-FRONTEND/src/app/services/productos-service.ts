import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Productos } from '../interfaces/productos';
import { API_URL } from './api';
@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  getAll() {
    return this.http.get<{ datos: Productos[] }>(API_URL + '/productos').pipe(map((r) => r.datos));
  }
  getByCategoria(categoria: string) {
    return this.http
      .get<{ datos: Productos[] }>(API_URL + '/productos', { params: { categoria } })
      .pipe(map((r) => r.datos));
  }
  crear(data: FormData) {
    return this.http.post(API_URL + '/productos', data);
  }
  actualizar(id: string, data: FormData) {
    return this.http.put(API_URL + '/productos/' + id, data);
  }
  delete(id: string) {
    return this.http.delete(API_URL + '/productos/' + id);
  }
}
