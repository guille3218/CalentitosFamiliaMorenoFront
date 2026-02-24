import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../interfaces/usuario.interface';

export interface AuthResponse {
  error: boolean;
  status: number;
  body: {
    token: string;
    user: Usuario;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  // Angular Signals para estado reactivo
  currentUser = signal<Usuario | null>(null);
  token = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.rol === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('cfm_token');
    const user = localStorage.getItem('cfm_user');
    if (token && user) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(user));
    }
  }

  private saveToStorage(token: string, user: Usuario): void {
    localStorage.setItem('cfm_token', token);
    localStorage.setItem('cfm_user', JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { username, password }).pipe(
      tap(res => {
        if (!res.error) {
          this.saveToStorage(res.body.token, res.body.user);
        }
      })
    );
  }

  register(data: {
    nombre: string; apellidos?: string; email: string;
    telefono?: string; direccion?: string; username: string; password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/register`, data).pipe(
      tap(res => {
        if (!res.error) {
          this.saveToStorage(res.body.token, res.body.user);
        }
      })
    );
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.api}/auth/me`);
  }

  logout(): void {
    localStorage.removeItem('cfm_token');
    localStorage.removeItem('cfm_user');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/menu']);
  }
}
