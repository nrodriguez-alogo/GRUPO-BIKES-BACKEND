import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    marca: { type: String, required: true, maxlength: 100 },
    modelo: { type: String, required: true, maxlength: 100 },
    descripcion: { type: String, required: true, maxlength: 2000 },
    imagen: { type: String, required: true },
    color: { type: String, required: true },
    categoria: { type: String, required: true, enum: ["Nuevas", "Usadas"] },
    precio: { type: Number, required: true, min: 0.01, max: 1e12 },
    estado: { type: String, required: true },
    cilindraje: { type: Number, required: true, min: 0.01, max: 10000 },
  },
  { timestamps: true },
);
export default model("productos", schema);
