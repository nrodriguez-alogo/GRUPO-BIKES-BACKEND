export const API_URL = '/api';
export function imageUrl(image: string | null | undefined): string {
  const clean = (image || 'usuarios/default-user.svg').replace(/^\/?imagenes\//, '');
  return API_URL + '/imagenes/' + clean.split('/').map(encodeURIComponent).join('/');
}
export function apiError(error: any): string {
  return typeof error?.error?.mensaje === 'string'
    ? error.error.mensaje
    : 'No se pudo conectar con el servidor. Intenta nuevamente.';
}
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,72}$/;
export function validImage(file: File): boolean {
  return (
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024
  );
}
