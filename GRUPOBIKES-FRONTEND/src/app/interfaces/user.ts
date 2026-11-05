export interface User {
_id?: string;
nombre: string;
correo: string;
imagen: string;
contrasena: string;
rol: 'usuario' | 'administrador';
}

export interface ServerResponse {
    mensaje: string;
    datos: User | any;
}
