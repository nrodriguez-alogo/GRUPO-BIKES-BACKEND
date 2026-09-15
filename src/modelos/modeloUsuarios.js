//nombre, correo, foto, contraseña, rol
import { Schema, model } from "mongoose";

const esquemaUsuarios = new Schema({
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/, "correo invalido"] },//expresión regular para correo
    foto: { type: String, required: true, },
    contraseña: { type: String, trim: true, match: [/^(?=.*[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, 'contraseña invalida'] },//expresión regular para contraseña
    rol: { type: String, required: true, enum:['administrador', 'usuario'], default:'usuario', trim: true },//"enum" restringe los roles a un parámetro definido y "default" asigna un rol por defecto al no ingresar dicho rol
});

export default model('productos', esquemaProductos);