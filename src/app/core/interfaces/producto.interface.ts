export type EstadoProducto = 'activo' | 'inactivo';

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
  codigo_sku?: string;
  stock_actual?: number;
  imagen_url?: string;
  estado: EstadoProducto;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  estado?: EstadoProducto;
  categoria?: string;
  codigo_sku?: string;
  stock_actual?: number;
  imagen_url?: string;
}
