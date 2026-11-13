import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { NoticiasService, Noticia } from '../../services/noticias-service';
import { apiError, imageUrl } from '../../services/api';
@Component({
  selector: 'app-anuncios',
  imports: [DatePipe],
  templateUrl: './anuncios.html',
  styleUrl: './anuncios.css',
})
export class Anuncios implements OnInit {
  private service = inject(NoticiasService);
  items = signal<Noticia[]>([]);
  loading = signal(false);
  error = signal('');
  expanded = signal<string | null>(null);
  imageUrl = imageUrl;
  ngOnInit() {
    this.load();
  }
  load() {
    this.error.set('');
    this.loading.set(true);
    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.items.set(r), error: (e) => this.error.set(apiError(e)) });
  }
  toggle(id: string) {
    this.expanded.set(this.expanded() === id ? null : id);
  }
}
