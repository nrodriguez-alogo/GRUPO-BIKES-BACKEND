import { Schema, model } from "mongoose";

const esquemaUsuarios = new Schema({
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "correo invalido"] },
    imagen: { type: String, required: false, default: 'imagenes/usuarios/default-user.svg' },
    contrasena: { type: String, required: true, trim: true, match: [/^(?=.*[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, 'contrasena invalida'] },
    rol: { type: String,
        enum:['usuario', 'administrador'],
        default:'usuario', 
        set:v =>{
            //Roles permitidos
            const rolesValidos = ['usuario', 'administrador'];

            //Condicional si no tiene valor, está vacío o tiene un valor no permitido como "administrador", asigna "usuario"
            if (!v || typeof v !== 'string' || v.trim() === '' || !rolesValidos.includes(v)){
                return 'usuario';
            }
            return v; //Retorna administrado o usuario.
        }
    }
});

export default model('usuarios', esquemaUsuarios);