import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UpdateUsuarioRequest, RolUsuario } from '../interfaces/usuario.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<any>(`${this.api}/usuarios`).pipe(
      map(res => res.body)
    );
  }

  getOne(id: number): Observable<Usuario> {
    return this.http.get<any>(`${this.api}/usuarios/${id}`).pipe(
      map(res => res.body)
    );
  }

  update(id: number, data: UpdateUsuarioRequest): Observable<Usuario> {
    return this.http.put<any>(`${this.api}/usuarios/${id}`, data).pipe(
      map(res => res.body)
    );
  }

  changeRol(id: number, rol: RolUsuario): Observable<any> {
    return this.http.put<any>(`${this.api}/usuarios/${id}/rol`, { rol }).pipe(
      map(res => res.body)
    );
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/usuarios/${id}`).pipe(
      map(res => res.body)
    );
  }
}
