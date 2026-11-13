import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { apiError, PASSWORD_PATTERN, validImage } from '../../services/api';
@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  busy = signal(false);
  mensaje = signal('');
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  registerForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    contrasena: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    rol: ['usuario', Validators.required],
    codigoAdministrador: [''],
  });
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    if (!file) return;
    if (!validImage(file)) {
      input.value = '';
      this.mensaje.set('Usa una imagen JPG, PNG o WebP de hasta 5 MB.');
      return;
    }
    this.mensaje.set('');
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }
  onSubmit() {
    if (this.busy()) return;
    const data = this.registerForm.getRawValue();
    if (
      this.registerForm.invalid ||
      !data.nombre.trim() ||
      (data.rol === 'administrador' && !data.codigoAdministrador.trim())
    ) {
      this.registerForm.markAllAsTouched();
      this.mensaje.set(
        'Completa los datos, usa una contraseña segura y, si eres administrador, ingresa tu invitación.',
      );
      return;
    }
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) form.append(key, value);
    if (this.selectedFile()) form.append('imagen', this.selectedFile()!);
    this.busy.set(true);
    this.mensaje.set('');
    this.auth
      .register(form)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) =>
          this.router.navigateByUrl(r.usuario.rol === 'administrador' ? '/administrador' : '/home'),
        error: (e) => this.mensaje.set(apiError(e)),
      });
  }
}
