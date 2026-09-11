//modelo, marca, foto, descripción, color, categoría, precio, estado, cilindraje
import { Schema } from "mongoose";

const esquemaProductos = new Schema({
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    descripción: { type: String, required: true, trim: true },
    foto: { type: String, required: true, },
    color: { type: String, trim: true },
    categoria: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, trim: true },
    estado: { type: String, required: true, trim: true },
    cilindraje: { type: Number, trim: true },
});

export default model('productos', esquemaProductos);