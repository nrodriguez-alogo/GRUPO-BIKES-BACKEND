import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { apiError } from '../../services/api';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  busy = signal(false);
  mensaje = signal('');
  CredentialsForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });
  handleSubmit() {
    if (this.busy()) return;
    if (this.CredentialsForm.invalid) {
      this.CredentialsForm.markAllAsTouched();
      this.mensaje.set('Ingresa un correo válido y tu contraseña.');
      return;
    }
    this.busy.set(true);
    this.mensaje.set('');
    this.auth
      .login(this.CredentialsForm.getRawValue())
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) =>
          this.router.navigateByUrl(r.usuario.rol === 'administrador' ? '/administrador' : '/home'),
        error: (e) => this.mensaje.set(apiError(e)),
      });
  }
}
