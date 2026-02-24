export type RolUsuario = 'cliente' | 'admin';
export type EstadoUsuario = 'activo' | 'inactivo';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  username?: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  fecha_registro?: string;
  fecha_actualizacion?: string;
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  apellidos?: string;
  email?: string;
  estado?: EstadoUsuario;
  telefono?: string;
  direccion?: string;
}
