//titulo, subtitulo, contenido, imagen, autor
import {Schema, model} from "mongoose";

const esquemaNoticias = new Schema({
    titulo: { type: String, required: true, trim: true },
    subtitulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true, trim: true },
    imagenNoticias: { type: String, required: true, },
    autor: { type: String, }
});

export default model('noticias', esquemaNoticias);