import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { productos, ApiProductos } from '../interfaces/productos';
import { response } from 'express';
import { Productos } from '../componentes/productos/productos';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3002/productos';

  getAll(): Observable<productos[]>{
    return this.http.get<ApiProductos>(this.API_URL).pipe(map(resp=>resp.data)
  );
  }
  getByCategoria(categoria: string): Observable<Productos[]>{
    return this.http.get<ApiProductos>(`${this.API_URL}?categoria=
      ${categoria}`).pipe(map(resp => resp.data)
    );
  }
  crear(formData: FormData): Observable<any> {
    return this.http.post(this.API_URL, formData);
  }
  actualizar(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }
  delete(id: string,): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
}
}

