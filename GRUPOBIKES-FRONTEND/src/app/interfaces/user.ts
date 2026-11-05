export interface User {
_id?: string;
nombre: string;
correo: string;
contraseña: string;
imagen: string;
rol: 'user' | 'administrador';
}

export interface ServerResponse {
    result: string;
    message: string;
    data: User | any;
}
