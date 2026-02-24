import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, CrearPedidoRequest, EstadoPedido } from '../interfaces/pedido.interface';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pedido[]> {
    return this.http.get<any>(`${this.api}/pedidos`).pipe(
      map(res => res.body)
    );
  }

  getOne(id: number): Observable<Pedido> {
    return this.http.get<any>(`${this.api}/pedidos/${id}`).pipe(
      map(res => res.body)
    );
  }

  crear(data: CrearPedidoRequest): Observable<any> {
    return this.http.post<any>(`${this.api}/pedidos`, data).pipe(
      map(res => res.body)
    );
  }

  updateEstado(id: number, estado: EstadoPedido): Observable<any> {
    return this.http.put<any>(`${this.api}/pedidos/${id}/estado`, { estado }).pipe(
      map(res => res.body)
    );
  }

  cancelar(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/pedidos/${id}/cancelar`, {}).pipe(
      map(res => res.body)
    );
  }
}
