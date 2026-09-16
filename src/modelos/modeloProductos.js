import { Schema, model } from "mongoose";

const esquemaProductos = new Schema({
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    foto: { type: String, required: true },
    color: { type: String, trim: true },
    categoria: { type: String, required: true, trim: true },
    precio: { type: Number, required: true },
    estado: { type: String, required: true, trim: true },
    cilindraje: { type: Number }
});

export default model('productos', esquemaProductos);