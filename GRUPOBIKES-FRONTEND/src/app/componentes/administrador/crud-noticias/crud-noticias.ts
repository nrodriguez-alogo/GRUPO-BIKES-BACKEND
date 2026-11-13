import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NoticiasService, Noticia } from '../../../services/noticias-service';
import { apiError, validImage, imageUrl } from '../../../services/api';
@Component({
  selector: 'app-crud-noticias',
  imports: [ReactiveFormsModule],
  templateUrl: './crud-noticias.html',
  styleUrl: './crud-noticias.css',
})
export class CrudNoticias implements OnInit {
  private service = inject(NoticiasService);
  private fb = inject(FormBuilder);
  items = signal<Noticia[]>([]);
  show = signal(false);
  busy = signal(false);
  loading = signal(false);
  message = signal('');
  error = signal('');
  file = signal<File | null>(null);
  preview = signal('');
  editing = signal<string | null>(null);
  imageUrl = imageUrl;
  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(160)]],
    subtitulo: ['', [Validators.required, Validators.maxLength(300)]],
    contenido: ['', [Validators.required, Validators.maxLength(30000)]],
    autor: ['', [Validators.required, Validators.maxLength(100)]],
  });
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(apiError(e)) });
  }
  create() {
    this.cancel();
    this.message.set('');
    this.show.set(true);
  }
  edit(item: Noticia) {
    this.cancel();
    this.editing.set(item._id!);
    this.form.reset(item);
    this.preview.set(imageUrl(item.imagen));
    this.show.set(true);
  }
  cancel() {
    this.show.set(false);
    this.editing.set(null);
    this.file.set(null);
    this.preview.set('');
    this.form.reset();
    this.error.set('');
  }
  select(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.file.set(null);
    if (!file) return;
    if (!validImage(file)) {
      input.value = '';
      this.error.set('Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.');
      return;
    }
    this.file.set(file);
    this.error.set('');
    const reader = new FileReader();
    reader.onload = () => this.preview.set(reader.result as string);
    reader.readAsDataURL(file);
  }
  save() {
    if (this.busy()) return;
    const data = this.form.getRawValue();
    if (
      this.form.invalid ||
      Object.values(data).some((v) => typeof v === 'string' && !v.trim()) ||
      (!this.editing() && !this.file())
    ) {
      this.form.markAllAsTouched();
      this.error.set('Completa todos los campos con valores válidos y selecciona una imagen.');
      return;
    }
    const body = new FormData();
    for (const [key, value] of Object.entries(data)) body.append(key, String(value));
    if (this.file()) body.append('imagen', this.file()!);
    this.busy.set(true);
    this.error.set('');
    const request = this.editing()
      ? this.service.actualizar(this.editing()!, body)
      : this.service.crear(body);
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => {
        this.cancel();
        this.message.set('Publicación guardada. Ya puedes verla en Noticias.');
        this.load();
      },
      error: (e) => this.error.set(apiError(e)),
    });
  }
  remove(item: Noticia) {
    if (this.busy() || !confirm('¿Eliminar esta publicación?')) return;
    this.busy.set(true);
    this.error.set('');
    this.service
      .delete(item._id!)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Publicación eliminada.');
          this.load();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
