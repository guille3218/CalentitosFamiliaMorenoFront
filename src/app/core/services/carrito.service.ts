import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { ItemCarrito } from '../interfaces/carrito.interface';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Signal principal del carrito
  items = signal<ItemCarrito[]>([]);

  // Computed values reactivos
  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  total = computed(() =>
    this.items().reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)
  );

  agregar(producto: Producto): void {
    const current = this.items();
    const idx = current.findIndex(i => i.producto.id === producto.id);
    if (idx >= 0) {
      // Ya existe: incrementar cantidad
      const updated = [...current];
      updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
      this.items.set(updated);
    } else {
      this.items.set([...current, { producto, cantidad: 1 }]);
    }
  }

  quitar(productoId: number): void {
    this.items.update(items => items.filter(i => i.producto.id !== productoId));
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(productoId);
      return;
    }
    this.items.update(items =>
      items.map(i => i.producto.id === productoId ? { ...i, cantidad } : i)
    );
  }

  vaciar(): void {
    this.items.set([]);
  }
}
