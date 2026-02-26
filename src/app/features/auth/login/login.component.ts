import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule, TranslocoModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCircleExclamation = faCircleExclamation;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  errorMsg = '';
  showPassword = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: (err) => {
        this.errorMsg = err?.error?.body || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}
