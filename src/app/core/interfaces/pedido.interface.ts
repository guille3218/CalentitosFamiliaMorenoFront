export type EstadoPedido = 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'completado' | 'cancelado';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'bizum';

export interface LineaPedido {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto_nombre?: string;
  imagen_url?: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  numero_pedido: string;
  estado: EstadoPedido;
  subtotal: number;
  total: number;
  metodo_pago: MetodoPago;
  direccion_envio?: string;
  telefono_contacto?: string;
  notas?: string;
  detalles?: LineaPedido[];
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  // Datos del cliente (en vista admin)
  cliente_nombre?: string;
  cliente_email?: string;
}

export interface CrearPedidoRequest {
  metodo_pago: MetodoPago;
  direccion_envio?: string;
  telefono_contacto?: string;
  notas?: string;
  items: { producto_id: number; cantidad: number }[];
}
