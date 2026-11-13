import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  { path: 'administrador', renderMode: RenderMode.Client },
  { path: 'usuarios', renderMode: RenderMode.Client },
  { path: 'productos', renderMode: RenderMode.Client },
  { path: 'noticias', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
