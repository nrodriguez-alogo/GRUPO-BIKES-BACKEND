import { Schema, model } from "mongoose";

const esquemaUsuarios = new Schema({
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "correo invalido"] },
    foto: { type: String, required: true },
    contraseña: { type: String, trim: true, match: [/^(?=.*[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, 'contraseña invalida'] },
    rol: { type: String, required: true, enum:['administrador', 'usuario'], default:'usuario', trim: true }
});

export default model('usuarios', esquemaUsuarios);