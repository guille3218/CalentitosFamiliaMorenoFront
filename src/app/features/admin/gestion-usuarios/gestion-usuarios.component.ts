import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, RolUsuario } from '../../../core/interfaces/usuario.interface';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowsRotate, faBan, faSquareCheck, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './gestion-usuarios.component.html',
})
export class GestionUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  // Icons
  faArrowsRotate = faArrowsRotate;
  faBan = faBan;
  faSquareCheck = faSquareCheck;
  faUsers = faUsers;

  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  toastMsg = signal('');

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.getAll().subscribe({
      next: (data) => { this.usuarios.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cambiarRol(usuario: Usuario, nuevoRol: RolUsuario): void {
    if (nuevoRol === usuario.rol) return;
    this.usuarioService.changeRol(usuario.id, nuevoRol).subscribe({
      next: () => {
        this.usuarios.update(us => us.map(u => u.id === usuario.id ? { ...u, rol: nuevoRol } : u));
        this.mostrarToast('Rol actualizado correctamente');
      }
    });
  }

  desactivar(usuario: Usuario): void {
    if (!confirm(`¿Desactivar a ${usuario.nombre} ${usuario.apellidos}?`)) return;
    this.usuarioService.desactivar(usuario.id).subscribe({
      next: () => {
        this.usuarios.update(us => us.map(u => u.id === usuario.id ? { ...u, estado: 'inactivo' } : u));
        this.mostrarToast('Usuario desactivado');
      }
    });
  }

  private mostrarToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 2500);
  }
}
