import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCircleExclamation = faCircleExclamation;

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: [''],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: [''],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  errorMsg = '';
  showPassword = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: (err) => {
        this.errorMsg = err?.error?.body || 'Error al registrar. Comprueba los datos.';
        this.loading = false;
      }
    });
  }
}
