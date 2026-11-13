import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { API_URL, apiError, PASSWORD_PATTERN } from '../../services/api';
@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recover.html',
  styleUrl: './recover.css',
})
export class Recover {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  mensaje = signal('');
  error = signal('');
  busy = signal(false);
  sent = signal(false);
  done = signal(false);
  recoverForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
  });
  resetForm = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9.$-]{10}$/)]],
    contrasena: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
  });
  handleRecover() {
    if (this.busy()) return;
    if (this.recoverForm.invalid) {
      this.error.set('Ingresa un correo electrónico válido.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.http
      .post<{ mensaje: string }>(
        API_URL + '/usuarios/olvidarContrasena',
        this.recoverForm.getRawValue(),
      )
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) => {
          this.mensaje.set(r.mensaje);
          this.sent.set(true);
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
  reset() {
    if (this.busy()) return;
    if (this.resetForm.invalid || this.recoverForm.invalid) {
      this.error.set('Completa el correo, la clave de 10 caracteres y una contraseña segura.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.http
      .post<{ mensaje: string }>(API_URL + '/usuarios/restablecerContrasena', {
        ...this.recoverForm.getRawValue(),
        ...this.resetForm.getRawValue(),
      })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) => {
          this.mensaje.set(r.mensaje);
          this.done.set(true);
          this.resetForm.reset();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
