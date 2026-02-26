import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido, EstadoPedido } from '../../../core/interfaces/pedido.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, faBoxOpen, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, TranslocoModule],
  templateUrl: './gestion-pedidos.component.html',
})
export class GestionPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);

  // Icons
  faBoxOpen = faBoxOpen;
  faArrowsRotate = faArrowsRotate;
  faSquareCheck = faSquareCheck;

  pedidos = signal<Pedido[]>([]);
  loading = signal(true);
  toastMsg = signal('');

  estados = [
    { value: 'pendiente' as EstadoPedido,  label: 'Pendiente' },
    { value: 'confirmado' as EstadoPedido, label: 'Confirmado' },
    { value: 'preparando' as EstadoPedido, label: 'Preparando' },
    { value: 'listo' as EstadoPedido,      label: 'Listo' },
    { value: 'completado' as EstadoPedido, label: 'Completado' },
    { value: 'cancelado' as EstadoPedido,  label: 'Cancelado' },
  ];

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading.set(true);
    this.pedidoService.getAll().subscribe({
      next: (data) => { this.pedidos.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido): void {
    if (nuevoEstado === pedido.estado) return;
    this.pedidoService.updateEstado(pedido.id, nuevoEstado).subscribe({
      next: () => {
        this.pedidos.update(ps => ps.map(p => p.id === pedido.id ? { ...p, estado: nuevoEstado } : p));
        this.toastMsg.set('Estado actualizado');
        setTimeout(() => this.toastMsg.set(''), 2500);
      }
    });
  }

  contarEstado(estado: EstadoPedido): number {
    return this.pedidos().filter(p => p.estado === estado).length;
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'badge-pendiente', confirmado: 'badge-confirmado',
      preparando: 'badge-preparando', listo: 'badge-listo',
      completado: 'badge-completado', cancelado: 'badge-cancelado'
    };
    return map[estado] ?? 'badge-pendiente';
  }
}
