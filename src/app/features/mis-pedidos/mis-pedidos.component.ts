import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { Pedido } from '../../core/interfaces/pedido.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './mis-pedidos.component.html',
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  pedidos = signal<Pedido[]>([]);
  loading = signal(true);

  // Icons
  faBoxOpen = faBoxOpen;

  ngOnInit(): void {
    this.pedidoService.getAll().subscribe({
      next: (data) => { this.pedidos.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'badge-pendiente',
      confirmado: 'badge-confirmado',
      preparando: 'badge-preparando',
      listo: 'badge-listo',
      completado: 'badge-completado',
      cancelado: 'badge-cancelado'
    };
    return map[estado] ?? 'badge-pendiente';
  }
}
