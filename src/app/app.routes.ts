import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: 'mis-pedidos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mis-pedidos/mis-pedidos.component').then(m => m.MisPedidosComponent)
  },
  {
    path: 'mis-pedidos/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mis-pedidos/detalle-pedido/detalle-pedido.component').then(m => m.DetallePedidoComponent)
  },
  {
    path: 'admin/pedidos',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/gestion-pedidos/gestion-pedidos.component').then(m => m.GestionPedidosComponent)
  },
  {
    path: 'admin/usuarios',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent)
  },
  { path: '**', redirectTo: 'menu' }
];
