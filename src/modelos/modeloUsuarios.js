import { Schema, model } from "mongoose";

const esquemaUsuarios = new Schema({
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "correo invalido"] },
    imagen: { type: String, required: true },
    contrasena: { type: String, required: true, trim: true, match: [/^(?=.*[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, 'contrasena invalida'] },
    rol: { type: String, required: true, enum:['administrador', 'usuario'], default:'usuario', set:v => (!v || v.trim() === '' ? 'usuario':v)}
});

export default model('usuarios', esquemaUsuarios);