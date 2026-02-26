import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { PedidoService } from '../../core/services/pedido.service';
import { CrearPedidoRequest } from '../../core/interfaces/pedido.interface';
import { faCartShopping, faCookieBite, faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule, TranslocoModule],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent {
  carrito = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Icons
  faCartShopping = faCartShopping;
  faXMark = faXmark;
  faCookieBite = faCookieBite;
  faCircleExclamation = faCircleExclamation;

  procesando = false;
  errorMsg = '';

  pedidoForm = this.fb.group({
    metodo_pago: ['', Validators.required],
    telefono_contacto: [''],
    notas: [''],
  });

  confirmarPedido(): void {
    if (this.pedidoForm.invalid || this.carrito.items().length === 0) return;
    this.procesando = true;
    this.errorMsg = '';

    const payload: CrearPedidoRequest = {
      metodo_pago: this.pedidoForm.value.metodo_pago as any,
      telefono_contacto: this.pedidoForm.value.telefono_contacto || undefined,
      notas: this.pedidoForm.value.notas || undefined,
      items: this.carrito.items().map(i => ({
        producto_id: i.producto.id,
        cantidad: i.cantidad
      }))
    };

    this.pedidoService.crear(payload).subscribe({
      next: () => {
        this.carrito.vaciar();
        this.router.navigate(['/mis-pedidos']);
      },
      error: (err) => {
        this.errorMsg = err?.error?.body || 'Error al procesar el pedido';
        this.procesando = false;
      }
    });
  }
}
