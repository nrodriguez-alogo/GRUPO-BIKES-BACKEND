import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    titulo: { type: String, required: true, maxlength: 160 },
    subtitulo: { type: String, required: true, maxlength: 300 },
    contenido: { type: String, required: true, maxlength: 30000 },
    autor: { type: String, required: true, maxlength: 100 },
    imagen: { type: String, required: true },
  },
  { timestamps: true },
);
export default model("noticias", schema);
