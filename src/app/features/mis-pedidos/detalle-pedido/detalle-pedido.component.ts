import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido, EstadoPedido } from '../../../core/interfaces/pedido.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardCheck, faClock, faCookieBite, faMortarPestle, faS, faSquareCheck, faXmark, faChevronLeft, faNoteSticky, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface TimelineStep {
  estado: EstadoPedido;
  label: string;
  icon: IconDefinition;
}

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './detalle-pedido.component.html',
})
export class DetallePedidoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);

  // Icons
  faCookieBite = faCookieBite;
  faXMark = faXmark;
  faClock = faClock;
  faMortarPestle = faMortarPestle;
  faClipboardCheck = faClipboardCheck;
  faSquareCheck = faSquareCheck;
  faChevronLeft = faChevronLeft;
  faNoteSticky = faNoteSticky;



  pedido = signal<Pedido | null>(null);
  loading = signal(true);
  cancelando = signal(false);

  timelineSteps: TimelineStep[] = [
    { estado: 'pendiente',  label: 'Pendiente',  icon: faClock },
    { estado: 'preparando', label: 'Preparando', icon: faMortarPestle },
    { estado: 'listo',      label: 'Listo para recoger', icon: faClipboardCheck },
    { estado: 'completado', label: 'entregado', icon: faSquareCheck },
  ];

  private readonly estadoOrden: EstadoPedido[] = ['pendiente', 'confirmado', 'preparando', 'listo', 'completado'];

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.pedidoService.getOne(id).subscribe({
      next: (p) => { this.pedido.set(p); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/mis-pedidos']); }
    });
  }

  getStepClass(stepEstado: EstadoPedido): string {
    return this.isStepActive(stepEstado)
      ? 'border-churro text-churro'
      : 'border-gray-300 text-gray-400';
  }

  isStepActive(stepEstado: EstadoPedido): boolean {
    const current = this.pedido()?.estado;
    if (!current) return false;
    const displayEstado = current === 'confirmado' ? 'preparando' : current;
    const currentIdx = this.estadoOrden.indexOf(displayEstado as EstadoPedido);
    const stepIdx = this.estadoOrden.indexOf(stepEstado);
    return stepIdx <= currentIdx;
  }

  getProgressWidth(): string {
    const current = this.pedido()?.estado;
    if (!current) return '0%';
    const displayEstado = current === 'confirmado' ? 'preparando' : current;
    const idx = this.timelineSteps.findIndex(s => s.estado === displayEstado);
    if (idx < 0) return '0%';
    const pct = (idx / (this.timelineSteps.length - 1)) * 100;
    return `${pct}%`;
  }

  cancelarPedido(): void {
    if (!this.pedido()) return;
    this.cancelando.set(true);
    this.pedidoService.cancelar(this.pedido()!.id).subscribe({
      next: () => this.router.navigate(['/mis-pedidos']),
      error: () => this.cancelando.set(false)
    });
  }

  goBack(): void {
    this.router.navigate(['/mis-pedidos']);
  }
}
