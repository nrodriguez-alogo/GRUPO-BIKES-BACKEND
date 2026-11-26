import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Productos, ApiProductos } from '../interfaces/productos';


@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3002/productos';

  getAll(): Observable<Productos[]>{
    return this.http.get<ApiProductos>(this.API_URL).pipe(map(resp=>resp.datos)
  );
  }
  getByCategoria(categoria: string): Observable<Productos[]>{
    return this.http.get<ApiProductos>(`${this.API_URL}?categoria=
      ${categoria}`).pipe(map(resp => resp.datos)
    );
  }
  crear(formData: FormData): Observable<any> {
    return this.http.post(this.API_URL, formData);
  }
  actualizar(id: string, datos: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, datos);
  }
  delete(id: string,): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
}
}

