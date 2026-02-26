import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto, ProductoRequest } from '../../core/interfaces/producto.interface';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBan, faCookieBite, faPlus, faSquareCheck, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, TranslocoModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  // Icons
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faBan = faBan
  faCircleCheck = faCircleCheck
  faCookieBite = faCookieBite;
  faSquareCheck = faSquareCheck;
  faHeart = faHeart;

  productos = signal<Producto[]>([]);
  categoriaActual = signal('');
  loading = signal(true);
  mostrarModal = signal(false);
  editandoProducto = signal<Producto | null>(null);
  guardando = signal(false);
  toastMsg = signal('');

  categorias = signal<string[]>([]);

  productosFiltrados = () => {
    const cat = this.categoriaActual();
    return this.productos().filter(p => !cat || p.categoria === cat);
  };

  productoForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    categoria: [''],
    codigo_sku: [''],
    stock_actual: [0],
    imagen_url: ['']
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading.set(true);
    const obs = this.auth.isAdmin()
      ? this.productoService.getAllAdmin()
      : this.productoService.getAll();

    obs.subscribe({
      next: (prods) => {
        this.productos.set(prods);
        const cats = [...new Set(prods.map(p => p.categoria).filter(Boolean) as string[])];
        this.categorias.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filtrarCategoria(cat: string): void {
    this.categoriaActual.set(cat);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
    this.toastMsg.set(`"${producto.nombre}" añadido al carrito`);
    setTimeout(() => this.toastMsg.set(''), 2500);
  }

  abrirModal(producto?: Producto): void {
    this.editandoProducto.set(producto ?? null);
    this.productoForm.reset();
    if (producto) {
      this.productoForm.patchValue(producto);
    }
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.editandoProducto.set(null);
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;
    this.guardando.set(true);
    const data = this.productoForm.value as ProductoRequest;
    const editando = this.editandoProducto();

    const obs = editando
      ? this.productoService.update(editando.id, data)
      : this.productoService.insert(data);

    obs.subscribe({
      next: () => {
        this.cerrarModal();
        this.guardando.set(false);
        this.cargarProductos();
      },
      error: () => this.guardando.set(false)
    });
  }

  toggleEstado(producto: Producto): void {
    if (producto.estado === 'activo') {
      this.productoService.delete(producto.id).subscribe(() => this.cargarProductos());
    } else {
      this.productoService.update(producto.id, { nombre: producto.nombre, precio: producto.precio, estado: 'activo' }).subscribe(() => this.cargarProductos());
    }
  }
}
