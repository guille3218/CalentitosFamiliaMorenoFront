import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoRequest } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(categoria?: string): Observable<Producto[]> {
    const params = categoria ? `?categoria=${categoria}` : '';
    return this.http.get<any>(`${this.api}/productos${params}`).pipe(
      map(res => res.body)
    );
  }

  getAllAdmin(): Observable<Producto[]> {
    return this.http.get<any>(`${this.api}/productos/admin`).pipe(
      map(res => res.body)
    );
  }

  getOne(id: number): Observable<Producto> {
    return this.http.get<any>(`${this.api}/productos/${id}`).pipe(
      map(res => res.body)
    );
  }

  insert(data: ProductoRequest): Observable<Producto> {
    return this.http.post<any>(`${this.api}/productos`, data).pipe(
      map(res => res.body)
    );
  }

  update(id: number, data: Partial<ProductoRequest>): Observable<Producto> {
    return this.http.put<any>(`${this.api}/productos/${id}`, data).pipe(
      map(res => res.body)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/productos/${id}`).pipe(
      map(res => res.body)
    );
  }
}
